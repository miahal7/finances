class TransactionsController < ApplicationController
  before_action :set_transaction, only: [:show, :edit, :destroy, :update]
  
  http_basic_authenticate_with name: '', password: ''

  # GET /transactions.json
  def index
    @ledger_date = params[:ledger_month]
    Rails.logger.debug("@ledger_date".center(100, "="))
    Rails.logger.debug("#{params[:ledger_month].inspect}")
    Rails.logger.debug("".center(100, "="))
    # Transaction.duplicate_recurring(@ledger_date)
    @transactions = Transaction.where(ledger_month: @ledger_date).includes(:vendor, :category)
    # @transactions = Transaction.all.includes(:vendor, :category)

    
    # logger.debug("transactions index -> @transactions: #{@transactions[0..3].to_json(include: [:vendor, :category])}")
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @transactions.to_json(include: [:vendor, :category]) }
    end
  end
  
  def bank_balance
    @bank_balance = Transaction.bank_balance(params[:ledger_month])
    render json: @bank_balance.to_json
  end

  def balance
    @balance = Transaction.balance(params[:ledger_month])
    render json: @balance.to_json
  end

  # GET /transactions/1.json
  def show
    render json: @transaction    
  end

  # GET /transactions/1/edit
  def edit
  end

  # POST /transactions.json
  def create
    # @transaction = Transaction.new(transaction_params)

    # if @transaction.save(transaction_params)
    #   render json: @transaction, status: :created, location: @transaction 
    # else
    #   render json: @transaction.errors, status: :unprocessable_entity
    # end
  end

  # PUT /transactions/1.json
  def update

    Rails.logger.debug("Saving transaction as:")    
    Rails.logger.debug("".center(100, "="))
    
    Rails.logger.debug("#{params.inspect}")
    Rails.logger.debug("".center(100, "="))

    if @transaction.update_all(transaction_params, params)
      render json: @transaction, layout: false
    else
      render json: 'unable to update', status: :unprocessable_entity, layout: false
    end
  end

  # DELETE /transactions/1.json
  def destroy    
    # @transaction.recurring ? @transaction.destroy_and_remove_recurring : @transaction.destroy
       
    render json: "success", layout: false, status: :ok    
  end
  
  private
    def set_transaction
      @transaction = Transaction.find(params[:id])
    end
    
    def transaction_params
      params.require(:transaction).permit(:id, :date, :amount, :cleared, :recurring, :deposit,
                                          :ledger_month, :created_at, :updated_at, 
                                          vendor: [:name], category: [:name])
    end
end





# [[3.24, 8.65, 18.0, 23.17, 40.4], [3.24, 5.0, 5.0, 25.02, 55.2]]