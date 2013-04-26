class CreateTransactions < ActiveRecord::Migration

  def change
    create_table :transactions do |t|
      t.date :date
      t.integer :vendor_id
      t.string :accounting_month
      t.integer :accounting_year, size: 4
      t.float :amount, precision: 9, scale: 2
      t.boolean :cleared
      t.boolean :recurring
      t.string :classification

      t.timestamps
    end
  end
end