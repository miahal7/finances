class TransactionCategory < ActiveRecord::Base
  belongs_to :transaction
  belongs_to :category
  
  validates :transaction_id, presence: true  
end
