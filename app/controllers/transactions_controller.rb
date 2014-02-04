class TransactionsController < ApplicationController
  # http_basic_authenticate_with name: '*****', password: '*****'
  # GET /transactions
  # GET /transactions.json
  def index
    @ledger_date = view_context.ledger_date
    Transaction.duplicate_recurring(@ledger_date)
    @transactions = Transaction.where(ledger_month: @ledger_date)
    #@transactions = Transaction.find_all_by_ledger_month(@ledger_date)

    if request.xhr?
      render partial: 'month', layout: false
      return
    end

    respond_to do |format|
      format.html # index.html.erb
      #format.json { render layout: false }
      format.json { render json: @transactions }
    end
  end

  # GET /transactions/1
  # GET /transactions/1.json
  def show
    @transaction = Transaction.find(params[:id])

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
    @transaction = Transaction.find(params[:id])
  end

  # POST /transactions
  # POST /transactions.json
  def create
    @transaction = Transaction.new(params[:transaction])

    respond_to do |format|
      if @transaction.save_all(params)
        format.html { redirect_to @transaction, notice: 'Transaction was successfully created.' }
        format.json { render json: @transaction, status: :created, location: @transaction }
      else
        format.html { render action: 'new' }
        format.json { render json: @transaction.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /transactions/1
  # PUT /transactions/1.json
  def update
    @transaction = Transaction.find(params[:id])

    logger.debug("==========PARAMS ARE #{params.inspect}")

    updated_value = @transaction.update_attrs(params)
    if updated_value != 'unable to update'
      logger.debug("############################RETURNING #{updated_value}")
      render json: updated_value, layout: false
    else
      logger.debug('############################RETURNING UNABLE TO UPDATE')
      render json: 'unable to update', status: :unprocessable_entity, layout: false
    end
  end

  # DELETE /transactions/1
  # DELETE /transactions/1.json
  def destroy
    @transaction = Transaction.find(params[:id], include: :vendor)
    vendor_name = @transaction.vendor.name.blank? ? 'Transaction' : "#{@transaction.vendor.name} transaction"

    @transaction.destroy_and_remove_recurring
    respond_to do |format|
      format.html { redirect_to transactions_url, notice: "#{vendor_name} was successfully deleted." }
      # render json: @transaction, layout: false
    end
  end
end
