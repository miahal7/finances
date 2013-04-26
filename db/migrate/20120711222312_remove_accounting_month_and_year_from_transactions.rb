class RemoveAccountingMonthAndYearFromTransactions < ActiveRecord::Migration
  def up
    remove_column :transactions, :accounting_month
    remove_column :transactions, :accounting_year
  end

  def down
    add_column :transactions, :accounting_month
    add_column :transactions, :accounting_year
  end
end
