class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # POST /users
  # POST /users.json
  def create
    if sign_in?
      current_user.update(user_params)
      render_json current_user
    else
      @user = User.new(user_params)
      if @user.save
        sign_in @user
        render_json @user
      else
        render_error @users.errors
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:display_name, :win_count, :lose_count, :remember_token)
    end
end
