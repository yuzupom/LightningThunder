class UserGameInfomationsController < ApplicationController
  before_action :set_user_game_infomation, only: [:show, :edit, :update, :destroy]

  # GET /user_game_infomations
  # GET /user_game_infomations.json
  def index
    @user_game_infomations = UserGameInfomation.all
  end

  # GET /user_game_infomations/1
  # GET /user_game_infomations/1.json
  def show
  end

  # GET /user_game_infomations/new
  def new
    @user_game_infomation = UserGameInfomation.new
  end

  # GET /user_game_infomations/1/edit
  def edit
  end

  # POST /user_game_infomations
  # POST /user_game_infomations.json
  def create
    @user_game_infomation = UserGameInfomation.new(user_game_infomation_params)

    respond_to do |format|
      if @user_game_infomation.save
        format.html { redirect_to @user_game_infomation, notice: 'User game infomation was successfully created.' }
        format.json { render :show, status: :created, location: @user_game_infomation }
      else
        format.html { render :new }
        format.json { render json: @user_game_infomation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_game_infomations/1
  # PATCH/PUT /user_game_infomations/1.json
  def update
    respond_to do |format|
      if @user_game_infomation.update(user_game_infomation_params)
        format.html { redirect_to @user_game_infomation, notice: 'User game infomation was successfully updated.' }
        format.json { render :show, status: :ok, location: @user_game_infomation }
      else
        format.html { render :edit }
        format.json { render json: @user_game_infomation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_game_infomations/1
  # DELETE /user_game_infomations/1.json
  def destroy
    @user_game_infomation.destroy
    respond_to do |format|
      format.html { redirect_to user_game_infomations_url, notice: 'User game infomation was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_game_infomation
      @user_game_infomation = UserGameInfomation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_game_infomation_params
      params.require(:user_game_infomation).permit(:life, :dragon_card_id, :called_dragon_card_id, :finger_1st, :finger_2nd, :finger_3rd, :finger_4th, :finger_5th, :parent, :user_id, :ai_id)
    end
end
