class Transaction < ActiveRecord::Base
  attr_accessible :amount, :cleared, :date, :month_id, :name_id, :recurring

  belongs_to :month
  has_one :name
  has_one :description, through: :name

  def self.all_info
    begin
      transaction_array = []

      transactions = Transaction.all
      transactions.each do |transaction|
        name = Name.find transaction.name_id
        desc = Description.find name.description_id

        t = {
          amount: transaction.amount,
          recurring: transaction.recurring,
          cleared: transaction.cleared,
          date: transaction.date,
          name: name.value,
          description: desc.value
        }

        transaction_array << t
      end

      return transaction_array
    end
  rescue Exception => e
    logger.info("Exception - #{e}")
    return false
  end
end
