class ReplaceClassificationWithDeposit < ActiveRecord::Migration
  def up
    remove_column :transactions, :classification
    add_column :transactions, :deposit, :boolean
  end

  def down
    remove_column :transactions, :deposit
    add_column :transactions, :classification, :string
  end
end
