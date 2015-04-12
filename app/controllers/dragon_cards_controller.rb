class DragonCardsController < ApplicationController
  before_action :set_dragon_card, only: [:show, :edit, :update, :destroy]

  # GET /dragon_cards
  # GET /dragon_cards.json
  def index
    @dragon_cards = DragonCard.all
  end

  # GET /dragon_cards/1
  # GET /dragon_cards/1.json
  def show
  end

  # GET /dragon_cards/new
  def new
    @dragon_card = DragonCard.new
  end

  # GET /dragon_cards/1/edit
  def edit
  end

  # POST /dragon_cards
  # POST /dragon_cards.json
  def create
    @dragon_card = DragonCard.new(dragon_card_params)

    respond_to do |format|
      if @dragon_card.save
        format.html { redirect_to @dragon_card, notice: 'Dragon card was successfully created.' }
        format.json { render :show, status: :created, location: @dragon_card }
      else
        format.html { render :new }
        format.json { render json: @dragon_card.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dragon_cards/1
  # PATCH/PUT /dragon_cards/1.json
  def update
    respond_to do |format|
      if @dragon_card.update(dragon_card_params)
        format.html { redirect_to @dragon_card, notice: 'Dragon card was successfully updated.' }
        format.json { render :show, status: :ok, location: @dragon_card }
      else
        format.html { render :edit }
        format.json { render json: @dragon_card.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dragon_cards/1
  # DELETE /dragon_cards/1.json
  def destroy
    @dragon_card.destroy
    respond_to do |format|
      format.html { redirect_to dragon_cards_url, notice: 'Dragon card was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_dragon_card
      @dragon_card = DragonCard.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def dragon_card_params
      params.require(:dragon_card).permit(:name, :short_word, :for_2_players, :for_3_players, :for_4_players, :main_text, :flavor_text)
    end
end
