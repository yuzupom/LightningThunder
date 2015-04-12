class User < ActiveRecord::Base
  has_many :user_game_infomations
  belongs_to :rooms

  before_create :create_remember_token

  validates :display_name, presence: true

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
      self.display_name = 'ななしさんの国' if self.display_name.blank?
    end
end
