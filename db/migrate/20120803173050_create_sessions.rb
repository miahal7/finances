class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
      t.string :month
      t.timestamps
    end
  end
end
