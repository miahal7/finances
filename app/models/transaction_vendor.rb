class TransactionVendor < ActiveRecord::Base
  #attr_accessible :transaction_id, :vendor_id

  belongs_to :transaction
  belongs_to :vendor
end
