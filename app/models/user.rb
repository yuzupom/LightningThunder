class User < ActiveRecord::Base
  has_one :user_game_infomation
  belongs_to :rooms

  before_create :create_remember_token

  validates :display_name, presence: true

  def to_h
    h = self.attributes
    h.delete("remember_token")
    h
  end

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end
end
