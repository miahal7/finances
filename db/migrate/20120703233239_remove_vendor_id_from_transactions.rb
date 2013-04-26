class RemoveVendorIdFromTransactions < ActiveRecord::Migration
  def up
    remove_column :transactions, :vendor_id
  end

  def down
    add_column :transactions, :vendor_id, :integer
  end
end
