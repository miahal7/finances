class AddLedgerMonthToTransactions < ActiveRecord::Migration
  def change
    add_column :transactions, :ledger_month, :date
  end
end
