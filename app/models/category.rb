class Category < ActiveRecord::Base
  has_many :transactions, through: :transaction_categories
  has_many :transaction_categories

  scope :named_like, lambda { |name| where("lower(name) like lower(?)", "#{name}%") }

  def self.typeahead
    categories = self.select("name").all

    #first change the array of hashes to an array of strings of the names of each category
    categories = categories.map &:name
    #then convert each item in the array to a string
    categories.map &:to_s
  end
end
