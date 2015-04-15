class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  include SessionsHelper

  def render_json(p)
    render json:p ,status: 200
  end

  def render_error(msg)
    render json:{error_message:msg} ,status: 400
  end
end
