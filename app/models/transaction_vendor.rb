class TransactionVendor < ActiveRecord::Base
  #attr_accessible :transaction_id, :vendor_id

  belongs_to :transaction
  belongs_to :vendor


  # This is not is use yet 2/2/2014
  # Proposal to replace the complex updating and saving in the Transaction model.
  # If this is deemed better by future me, it would also work well for categories.
  # This may eventually wind up in the Transaction model as update_vendor.
  # +params[:id]+ and +params[:vendor_name]+ are required.
	def self.update(params)
		begin
		# Get the transaction with its associated transaction_vendor
		@transaction = Transaction.includes(:transaction_vendor).find(params[:id])
		# Find the vendor by name or create it if it doesn't exist
		@vendor = Vendor.find_or_create_by(name: params[:vendor_name])

		# Update the transaction_vendor to the new vendor
		@transaction.transaction_vendor.vendor_id = @vendor.id

		# Save the transaction_vendor record (save! returns true on save success
		# and raises exception otherwise)
		@transaction.transaction_vendor.save!
		rescue => e
			logger.warn "Error changing vendor in TransactionVendor.update: #{e}"
			false
		end
	end
end
