require 'csv'

class Transaction < ActiveRecord::Base
  self.include_root_in_json = false
  
	has_one :transaction_vendor, dependent: :destroy
	has_one :transaction_category, dependent: :destroy
	has_one :vendor, through: :transaction_vendor
	has_one :category, through: :transaction_category
  
  accepts_nested_attributes_for :vendor
  accepts_nested_attributes_for :category

	def self.ledger_total
		ledger_add = Transaction.select('amount, ledger_month').where(deposit: true)
		ledger_sub = Transaction.select('amount, ledger_month').where(deposit: false)

		#TODO: use proc to map when ledger month <= Time.now
		#ledger_add = ledger_add.map(&:amount).inject(:+) || 0
		#ledger_sub = ledger_sub.map(&:amount).inject(:+) || 0

		add = []
		sub = []

		ledger_add.each do |t|
			add.push(t.amount) if t.ledger_month <= Date.current && !t.amount.nil?
		end

		ledger_sub.each do |t|
			sub.push(t.amount) if t.ledger_month <= Date.current && !t.amount.nil?
		end

		add = add.inject(:+) || 0
		sub = sub.inject(:+) || 0

		puts "ledger_add -> #{add}"
		puts "ledger_sub -> #{sub}"
		return add - sub
	end

	def self.bank_total
		bank_add = Transaction.select('amount, ledger_month').where(deposit: true, cleared: true)
		bank_sub = Transaction.select('amount, ledger_month').where(deposit: false, cleared: true)

		#TODO: use proc to map when ledger month <= Time.now
		#bank_add = bank_add.map(&:amount).inject(:+) || 0
		#bank_sub = bank_sub.map(&:amount).inject(:+) || 0

		add = []
		sub = []

		bank_add.each do |t|
			add.push(t.amount) if t.ledger_month <= Date.current && !t.amount.nil?
		end

		bank_sub.each do |t|
			sub.push(t.amount) if t.ledger_month <= Date.current && !t.amount.nil?
		end

		add = add.inject(:+) || 0
		sub = sub.inject(:+) || 0

		puts "bank_add -> #{add}"
		puts "bank_sub -> #{sub}"

		return add - sub
	end

	# When a transaction is destroyed, any recurring transactions from the previous month will duplicate if it doesn't
	# exist in the current month.  This method prevents this by first setting recurring to false on the previous month's
	# matching recurring transaction and then deleting the selected record
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

	#save_all saves the transaction information along with the vendor and transaction_vendor information
	def save_all(params)
		begin
			if self.save
				vendor = Vendor.find_or_initialize_by_name(params[:vendor_name])
				vendor.save

				transaction_vendor = TransactionVendor.new
				transaction_vendor.vendor_id = vendor.id
				transaction_vendor.transaction_id = self.id
				transaction_vendor.save

				category = Category.find_or_initialize_by_name(params[:category_name])
				category.save

				transaction_category = TransactionCategory.new
				transaction_category.category_id = category.id
				transaction_category.transaction_id = self.id
				transaction_category.save
			else
				return false
			end
		rescue Exception => e
			logger.info("Error in Transaction#save_all - #{e}")
			return false
		end
	end

	def update_all(transaction_params, params)
		begin
			if self.update_attributes(transaction_params)
        
        # Checks if the vendor or category has changed. If it has, updates the intermediate table to point to the 
        # new vendor or category 
        %w(vendor category).each do |attr| 
          attribute = attr.capitalize.constantize.find_or_initialize_by(name: params[attr.to_sym][:name])
          attribute.save          
          # Get the associated transaction_vendor or transaction_category. If the vendor/category has changed then 
          # point the transaction_vendor/category to the correct vendor/category. Otherwise, leave it alone.
          transaction_attr = "transaction_#{attr}".camelize.constantize.where(transaction_id: self.id)[0]
          if transaction_attr.send("#{attr}_id") != attribute.id
   				  transaction_attr.send("#{attr}_id=", attribute.id)
            transaction_attr.save
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

	# Updates only the attribute that is passed, returns the updated value
	def update_attrs(params)
		if params[:amount]
			if self.update_attribute(:amount, params[:amount])
				return self.amount
			end
		elsif params[:recurring]
			if self.update_attribute(:recurring, params[:recurring])
				return self.recurring
			end
		elsif params[:cleared]
			if self.update_attribute(:cleared, params[:cleared])
				return self.cleared
			end
		elsif params[:deposit]
			if self.update_attribute(:deposit, params[:deposit])
				return self.deposit
			end
		elsif params[:date]
			if self.update_attribute(:date, params[:date])
				return self.date
			end
		elsif params[:ledger_month]
			if self.update_attribute(:ledger_month, params[:ledger_month])
				return self.ledger_month
			end
		elsif params[:vendor_name]
			# Gets vendor then finds the joining transaction_vendor record, then updates
			# it with the proper vendor_id
			vendor = Vendor.where(name: params[:vendor_name])
			if vendor.nil?
				vendor = Vendor.new
				vendor.name = params[:vendor_name]
			end
			if vendor.save
				tv = TransactionVendor.find_or_initialize_by_transaction_id(self.id)
				tv.vendor_id = vendor.id
				if tv.save
					return vendor.name
				end
			end
		elsif params[:category_name]
			# Gets category then finds the joining transaction_category record, then updates
			# it with the proper category_id
			category = Category.where(name: params[:category_name])
			logger.debug("********CATEGORY FOUND #{category.inspect}")
			if category.nil?
				category = Category.new
				category.name = params[:category_name]
			end
			if category.save
				tc = TransactionCategory.find_or_initialize_by_transaction_id(self.id)
				logger.debug("**********TRANSACTION CATEGORY FOUND #{tc.inspect}")
				tc.category_id = category.id
				if tc.save
					return category.name
				end
			end
		end
		return 'unable to update'
	end


	def self.extract
		puts "STARTING EXTRACT OF #{@file}"

		csv = CSV.open("#{Rails.root}/bk_download.csv")

		csv.each_with_index do |row, i|
			if row.blank?
				puts "\n\t\tSkipping row #{i} because it's blank\n\n\n"
				next
			end

			puts "---------- Saving row #{i} ------------------------------"

			cleared = (row[0] == 'posted') ? true : false
			date = Date.strptime(row[2], '%m/%d/%Y')
			ledger_month = Date.strptime(row[2], '%m/%d/%Y').strftime('%Y-%m-01')
			deposit = (row[6].to_d > 0.00) ? true : false
			amount = row[6].sub('-', '').to_d

			vendor = row[4]
			category = row[5]

			vendor = humanize_phrase(row[4])
			category = humanize_phrase(row[5])

			params = {vendor_name: vendor, category_name: category}

			puts "deposit: #{deposit}, cleared: #{cleared}, date: #{date}, ledger_month: #{ledger_month}, vendor: #{vendor}, category: #{category}, amount: #{amount}"

			t = Transaction.new
			t.date = date
			t.amount = amount
			t.cleared = cleared
			t.recurring = false
			t.ledger_month = ledger_month
			t.deposit = deposit

			t.save
			t.save_all(params)

			puts "----------- Save Successful -----------------------------\n\n"
		end


	end

	# Removes all the weird formatting from the bank csv download and then capitalizes each word.
	def self.humanize_phrase(phrase)
		phrase = "#{phrase.split('   ')[0].split('#')[0].split('- ')[0].split('**')[0].split('~')[0]}"
		phrase.downcase.split.map(&:capitalize).join(' ')
	end


end
