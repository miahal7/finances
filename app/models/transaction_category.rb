class TransactionCategory < ActiveRecord::Base
  #attr_accessible :category_id, :transaction_id

  belongs_to :transaction
  belongs_to :category
end
