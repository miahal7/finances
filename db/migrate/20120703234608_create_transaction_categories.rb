class CreateTransactionCategories < ActiveRecord::Migration
  def change
    create_table :transaction_categories do |t|
      t.integer :category_id
      t.integer :transaction_id

      t.timestamps
    end
  end
end
