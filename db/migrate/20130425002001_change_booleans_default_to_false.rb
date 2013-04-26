class ChangeBooleansDefaultToFalse < ActiveRecord::Migration
  def change
    change_column :transactions, :deposit, :boolean, default: false
    change_column :transactions, :cleared, :boolean, default: false
    change_column :transactions, :recurring, :boolean, default: false
  end
end
