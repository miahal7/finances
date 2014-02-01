class Vendor < ActiveRecord::Base
  has_many :transactions, through: :transaction_vendors
  has_many :transaction_vendors

  scope :named_like, lambda { |name|
	  vendors = select('name as value').where('lower(name) like lower(?)', "#{name}%").limit(5)
	  #vendors.to_json
  }

  def self.typeahead
    vendors = Vendor.select("name").all.limit(5)

    #first change the array of hashes to an array of strings of the names of each vendor
    #vendors = vendors.map &:name
    #then convert each item in the array to a string

    logger.info "==============VENDORS RETURNED ARE: #{vendors}"

    vendors.map &:to_s
  end
end
