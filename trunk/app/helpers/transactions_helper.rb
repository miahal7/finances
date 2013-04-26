module TransactionsHelper
  def get_name_record(name_id)
    Name.find name_id
  end

  def transaction_name(name_id)
    get_name_record(name_id).value
  end

  def transaction_desc(name_id)
    Description.find(get_name_record(name_id).description_id).value
  end
end
