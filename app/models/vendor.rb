class Vendor < ActiveRecord::Base
  has_many :transactions, through: :transaction_vendors
  has_many :transaction_vendors

  scope :named_like, lambda { |name| name.empty?? [] : select(:id, :name).where('lower(name) like lower(?)', "%#{name}%").limit(5) }
end
