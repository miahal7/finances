class Transaction < ActiveRecord::Base
	has_one :transaction_vendor, dependent: :destroy
	has_one :transaction_category, dependent: :destroy
	has_one :vendor, through: :transaction_vendor
	has_one :category, through: :transaction_category
  
  accepts_nested_attributes_for :vendor
  accepts_nested_attributes_for :category
  
  before_create :build_transaction_vendor, :build_transaction_category
  
  # validates_associated :vendor
  # validates_associated :category
  

  def self.balance(ledger_month)
    @transactions = Transaction.where.not(ledger_month: ledger_month)
    @amount = 0
    
    @transactions.each do |t|
      if t.deposit == true
        @amount = @amount + t.amount 
      else
        @amount = @amount - t.amount 
      end
    end

    return @amount
  end

  def self.bank_balance(ledger_month)
    @transactions = Transaction.where.not(ledger_month: ledger_month, cleared: false)
    @amount = 0
    
    @transactions.each do |t|
      if t.deposit == true
        @amount = @amount + t.amount 
      else
        @amount = @amount - t.amount 
      end
    end

    return @amount  
  end

	# When a transaction is destroyed, any recurring transactions from the previous month will duplicate if it 
  # doesn't exist in the current month.  This method prevents this by first setting recurring to false on the 
  # previous month's matching recurring transaction and then deleting the selected record
	def destroy_and_remove_recurring
		date = self.date.blank? ? '01-01-2000' : self.date - 1.month
		vendor_name = self.vendor.name.blank? ? '' : self.vendor.name

		prev_mo_rec = Transaction.includes(:vendor).where('vendors.name = ? and date = ?', vendor_name, date).first
		if prev_mo_rec.nil?
			self.destroy
		else
			prev_mo_rec.recurring = false
			prev_mo_rec.save! ? self.destroy : false
		end
	end	
  
  # Updates the transaction, transaction_
	def update_all(transaction_params, params)
		begin
			if self.update(transaction_params)        
        # Checks if the vendor or category has changed. If it has, updates the intermediate table to point to the 
        # new vendor or category 
        %w(vendor category).each do |attr| 
          unless params[attr.to_sym].blank?
            attribute = attr.capitalize.constantize.find_or_initialize_by(name: params[attr.to_sym][:name])
            attribute.save          
            # Get the associated transaction_vendor or transaction_category. If the vendor/category has changed then 
            # point the transaction_vendor/category to the correct vendor/category. Otherwise, leave it alone.
           # transaction_attr = "transaction_#{attr}".camelize.constantize.where(transaction_id: self.id)[0]
            trans_attr = self.send("transaction_#{attr}")
          
            if trans_attr.send("#{attr}_id") != attribute.id
     				  trans_attr.send("#{attr}_id=", attribute.id)
              trans_attr.save
            end
          end
        end 
			else
				return false
			end
		rescue Exception => e
			logger.info("Error in Transaction#update_all - #{e}")
			return false
		end
	end
  
  
  
  
  
  
  # NOT SURE THIS IS NEEDED
	# Duplicates the previous month's recurring elements to the next month if they don't already exist
	def self.duplicate_recurring(date)
		start_time = Time.now
		date = Date.strptime(date, '%Y-%m-%d')
		this_ledger_month = date
		prev_ledger_month = date - 1.month
		#prev_mo_rec = Transaction.find_all_by_ledger_month_and_recurring(prev_ledger_month, true)
		prev_mo_rec = Transaction.where(ledger_month: prev_ledger_month, recurring: true)
		#this_mo_rec = Transaction.find_all_by_ledger_month(this_ledger_month)
		this_mo_rec = Transaction.where(ledger_month: this_ledger_month)


		prev_mo_rec.each do |p_mo|
			match = false

			vendor = p_mo.vendor
			category = p_mo.category

			unless vendor.nil?
				logger.info("================== Checking for vendor #{vendor.name} =========================")

				this_mo_rec.each do |t_mo|
					if !t_mo.vendor.nil?
						logger.info(" ==== compare to #{t_mo.vendor.name}")
						if vendor.name == t_mo.vendor.name
							logger.info("    -- MATCH, not adding another #{t_mo.vendor.name} to db")
							match = true
							break
						end
					end
				end

				if !match
					logger.info("    -- no match, adding new transaction to ledger #{p_mo.vendor.name}")

					new_rec_date = p_mo.date + 1.month


					new_rec = Transaction.new
					new_rec.amount = p_mo.amount
					new_rec.date = new_rec_date
					new_rec.cleared = false
					new_rec.recurring = p_mo.recurring
					new_rec.ledger_month = date
					new_rec.deposit = p_mo.deposit
					new_rec.vendor = vendor
					new_rec.category = category
					new_rec.save
					logger.info("THE NEW RECURRING TRANSACTION CREATED IS -> #{new_rec.inspect}")
					#Transaction.save_all(new_rec, params)
				end
			end

		end

		#date - 1 month
		#get all recurring from prev month
		#check if they exist in current month
		#if they don't add them
		logger.info("Total time taken -> #{Time.now - start_time}")
		logger.info("==========================================================================")
		return nil
	end
end