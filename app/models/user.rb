class User < ActiveRecord::Base

  has_one :user_game_infomation
  belongs_to :room

  before_create :create_remember_token

  validates :display_name, presence: true

  def finger
    (self.user_game_infomation)? self.user_game_infomation.finger : nil
  end

  def saveFingers(fingers)
    fingers = fingers.to_i
    arr = []
    5.times{|i| arr << (fingers >= i+1)}
    self.user_game_infomation.update(
      finger_1st: arr[0],
      finger_2nd: arr[1],
      finger_3rd: arr[2],
      finger_4th: arr[3],
      finger_5th: arr[4]
      )
  end

  def entries?
    room.present?
  end

  def to_h(option = {:except => ["remember_token"]})
    h = self.attributes
    h["game_infomation"] = has_game_infomation?(option)? user_game_infomation.to_h(option[:position]) : nil
    if option[:except].present?
      option[:except].each{|k| h.delete(k)}
    end
    h["seated_room_id"] = h.delete("room_id") if h.has_key? "room_id"
    h
  end

  def has_game_infomation? option
    user_game_infomation && room && option[:position]
  end

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private
    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token) unless self.ai_id
    end
end
