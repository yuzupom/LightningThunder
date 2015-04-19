#encode:utf-8

class UsersController < ApplicationController
  def index
    @users = User.all
    render_json @users.to_a.map{|user| user.to_h}
  end

  def show
    return unless user_sign_in?
    render_json @current_user.to_h
  end

  def create
    #TODO remove comment out
    # if sign_in?
    #   current_user.update(user_params)
    #   render_json current_user.to_h
    # else
      params[:user]={} if params[:user].blank?
      params[:user][:display_name] = default_name if params[:user][:display_name].blank? || !params[:user][:display_name].end_with?("国")
      @user = User.new(user_params)
      if @user.save
        sign_in @user
        render_json @user.to_h
      else
        render_error @user.errors
      end
    # end
  end

  private
    def default_name
      #TODO
      'ななしさんの国'
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:display_name, :win_count, :lose_count, :remember_token)
    end
end
