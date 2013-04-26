module TransactionsHelper
  # Used in transaction _form
  def vendor_name(transaction)
    transaction.vendor.nil? ? '' : transaction.vendor.name
  end

  # Used in transaction _form
  def category_name(transaction)
    transaction.category.nil? ? '' : transaction.category.name
  end

  # Used in transaction _month (inside of table)
  def display(attr)
    attr unless attr.nil?
  end

  # Formats date to a more readable M dd, yyyy
  def format_date(date)
    return date if date.nil?
    Date.strptime(date.to_s, '%Y-%m-%d').strftime('%b %d, %Y')
  end

  def month_name
    Session.save_month(@ledger_date)
    Date.strptime(@ledger_date, '%Y-%m-%d').strftime('%B %Y')
  end

  def next_month
    #TODO lock screen on next_month and prev_month click to prevent datatables errors
    session[:direction] = 'next'
    Date.strptime(@ledger_date, '%Y-%m-%d').next_month
  end

  def prev_month
    session[:direction] = 'prev'
    Date.strptime(@ledger_date, '%Y-%m-%d').prev_month
  end

  def ledger_date
    date = params[:ledger_date].nil? ? session_date : Date.strptime(params[:ledger_date], '%Y-%m-%d')
    date.strftime('%Y-%m-01')
  end

  def session_date
    Session.first.nil? ? Time.now : Session.first.month
  end

  def checked(boolVal)
    "checked='checked'" if boolVal == true
  end

  def set_balances
    @bank_balance = Transaction.bank_total || 0
    @ledger_balance = Transaction.ledger_total || 0

    @ledger_balance = (number_to_currency(@ledger_balance) == '-$0.00')? 0.00 : @ledger_balance
    @bank_balance = (number_to_currency(@bank_balance) == '-$0.00') ? 0.00 : @bank_balance
  end

  def active(transaction, field)
    active = 'active' if transaction.cleared && field == 'cleared'
    active = 'active' if transaction.recurring && field == 'recurring'
    active = 'active' if transaction.deposit && field == 'deposit'

    return active
  end

  def green(transaction)
    'green' if transaction.deposit
  end

  def blue(transaction)
    'blue' if transaction.recurring
  end

  def format_currency(number)
    num_str = number.to_s

    if num_str.length == 0
      num_str = '0.00'
    end

    if num_str.index('.') == 0
      num_str = "0#{num_str}"
    elsif num_str.index('.') == 0 and num_str.length == 1
      num_str = '0.00'
    elsif num_str.index('.') == -1
      num_str.concat('.00')
    elsif num_str.index('.') == num_str.length - 1
      num_str.concat('00')
    elsif num_str.index('.') == num_str.length - 2
      num_str.concat('0')
    end

    return num_str
  end

end
