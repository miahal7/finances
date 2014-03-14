class TransactionsController < ApplicationController
  before_action :set_transaction, only: [:show, :edit, :destroy, :update]
  
  http_basic_authenticate_with name: '', password: ''

  # GET /transactions.json
  def index
    @ledger_date = view_context.ledger_date
    # Transaction.duplicate_recurring(@ledger_date)
    @transactions = Transaction.where(ledger_month: @ledger_date).includes(:vendor, :category)

    
    # logger.debug("transactions index -> @transactions: #{@transactions[0].to_json(include: [:vendor, :category])}")
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @transactions.to_json(include: [:vendor, :category]) }
    end
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
    @transaction = Transaction.new(transaction_params)

    if @transaction.save(transaction_params)
      render json: @transaction, status: :created, location: @transaction 
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  # PUT /transactions/1.json
  def update
    if @transaction.update_all(transaction_params, params)
      render json: @transaction, layout: false
    else
      render json: 'unable to update', status: :unprocessable_entity, layout: false
    end
  end

  # DELETE /transactions/1.json
  def destroy    
    @transaction.recurring ? @transaction.destroy_and_remove_recurring : @transaction.destroy
       
    render json: "success", layout: false, status: :ok    
  end
  
  private
    def set_transaction
      @transaction = Transaction.find(params[:id])
    end
    
    def transaction_params
      params.require(:transaction).permit(:id, :date, :amount, :cleared, :recurring, :deposit,
                                          :ledger_month, :created_at, :updated_at, vendor: [:name], category: [:name])
    end
end
