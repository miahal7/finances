class Vendor < ActiveRecord::Base
  attr_accessible :category_id, :name

  has_many :transactions, through: :transaction_vendors
  has_many :transaction_vendors

  scope :named_like, lambda { |name| where("lower(name) like lower(?)", "#{name}%") }

  def self.typeahead
    vendors = Vendor.select("name").all

    #first change the array of hashes to an array of strings of the names of each vendor
    vendors = vendors.map &:name
    #then convert each item in the array to a string
    vendors.map &:to_s
  end
end
