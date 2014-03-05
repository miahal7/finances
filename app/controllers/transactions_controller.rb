class TransactionsController < ApplicationController
  before_action :set_transaction, only: [:show, :edit, :destroy] #:update
  
  http_basic_authenticate_with name: '', password: ''

  # GET /transactions
  # GET /transactions.json
  def index
    @ledger_date = view_context.ledger_date
    Transaction.duplicate_recurring(@ledger_date)
    @transactions = Transaction.where(ledger_month: @ledger_date).includes(:vendor, :category)

    
    logger.debug("transactions index -> @transactions: #{@transactions.to_json(include: [:vendor, :category])}")
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @transactions.to_json(include: [:vendor, :category]) }
    end
  end

  # GET /transactions/1
  # GET /transactions/1.json
  def show

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @transaction }
    end
  end

  # GET /transactions/new
  # GET /transactions/new.json
  def new
    @transaction = Transaction.new
    @transaction.build_transaction_vendor

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @transaction }
    end
  end

  # GET /transactions/1/edit
  def edit
  end

  # POST /transactions
  # POST /transactions.json
  def create
    @transaction = Transaction.new(transaction_params)

    respond_to do |format|
      if @transaction.save_all(transaction_params, params)
        logger.debug("transaction created -> #{@transaction.inspect}")
        # format.html { redirect_to @transaction, notice: 'Transaction was successfully created.' }
        format.json { render json: @transaction, status: :created, location: @transaction }
      else
        # format.html { render action: 'new' }
        format.json { render json: @transaction.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /transactions/1
  # PUT /transactions/1.json
  def update
    @transaction = Transaction.find(params[:id])

     logger.debug("==========PARAMS ARE #{params.inspect}")

    # updated_value = @transaction.update_attrs(params)
    # if updated_value != 'unable to update'
    if @transaction.update_all(transaction_params, params)
      # logger.debug("############################RETURNING #{updated_value}")
      render json: @transaction, layout: false
    else
      # logger.debug('############################RETURNING UNABLE TO UPDATE')
      render json: 'unable to update', status: :unprocessable_entity, layout: false
    end
  end

  # DELETE /transactions/1
  # DELETE /transactions/1.json
  def destroy    
    if @transaction.recurring
      @transaction.destroy_and_remove_recurring
    else
      @transaction.destroy
    end
    
    render json: "success", layout: false, status: :ok    
  end
  
  private
    def set_transaction
      @transaction = Transaction.find(params[:id])
    end
    
    def transaction_params
      params.require(:transaction).permit(:id, :date, :amount, :cleared, :recurring, :deposit,
                                          :ledger_month, :created_at, :updated_at)
    end
end
