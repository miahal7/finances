class RemoveCategoryIdFromVendors < ActiveRecord::Migration
  def up
    remove_column :vendors, :category_id
    remove_column :vendors, :transaction_id
  end

  def down
    add_column :vendors, :category_id, :integer
    add_column :vendors, :transaction_id, :integer
  end
end
