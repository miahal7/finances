class ChangeMonthFromStringToDateInSessions < ActiveRecord::Migration
  def up
    remove_column :sessions, :month
    add_column :sessions, :month, :date
  end

  def down
    remove_column :sessions, :month
    add_column :sessions, :month, :string
  end
end
