class Category < ActiveRecord::Base
  has_many :transactions, through: :transaction_categories
  has_many :transaction_categories

  scope :named_like, lambda { |name| name.empty?? [] : select(:id, :name).where('lower(name) like lower(?)', "%#{name}%").limit(5) }

end
