class Session < ActiveRecord::Base
  #attr_accessible :month

  def self.save_month(date)
    session = self.first.nil? ? self.new : self.first
    session.month = date

    if session.save!
      return true
    else
      return false
    end
  end
end
