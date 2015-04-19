class User < ActiveRecord::Base
  has_one :user_game_infomation
  belongs_to :room

  before_create :create_remember_token

  validates :display_name, presence: true

  def entries?
    room.present?
  end

  def to_h(option = {:except => ["remember_token"]})
    h = self.attributes
    h["seated_room_id"] = h.delete("room_id") if h.has_key? "room_id"
    if option[:except].present?
      option[:except].each{|k| h.delete(k)}
    end
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
