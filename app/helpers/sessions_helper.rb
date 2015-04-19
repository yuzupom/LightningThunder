module SessionsHelper

  def user_sign_in?
    return render_error "you did not sign_in yet" unless sign_in?
    return true
  end

  def sign_in(user)
    remember_token = User.new_remember_token
    cookies.permanent[:remember_token] = remember_token
    user.update_attribute(:remember_token, User.encrypt(remember_token))
    self.current_user = user
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    @current_user ||= User.find_by(remember_token: User.encrypt(cookies[:remember_token]))
  end

  def signed_in?
    current_user.present?
  end

  def sign_in?
    signed_in?
  end

  def sign_out
    self.current_user = nil
    cookies.delete(:remember_token)
  end
end