class ChangeTransactionClassificationToBool < ActiveRecord::Migration
  def up
    remove_column :transactions, :classification
    add_column :transactions, :classification, :boolean
  end

  def down
    remove_column :transactions, :classification
    add_column :transactions, :classification, :string
  end
end
