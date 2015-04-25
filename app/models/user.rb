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
    h["game_infomation"] =
      if has_game_infomation?
        user_game_infomation.to_h(position(option[:current_user]))
      end
    if option[:except].present?
      option[:except].each{|k| h.delete(k)}
    end
    h["seated_room_id"] = h.delete("room_id") if h.has_key? "room_id"
    h
  end

  def has_game_infomation?
    user_game_infomation && room
  end

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def right_person current_user
    arr = [:OPPONENT, :RIGHT_PERSON, :THIRD_LEFT_PERSON]
    room.users.find{|user|
      arr.include? user.position(current_user)
    }
  end

  def position current_user
    return nil unless current_user
    return :YOU if self == current_user
    current_user_position = -1
    target_user_position = -1
    room.users.length.times{|i|
      current_user_position = i if room.users[i] == current_user
      target_user_position  = i if room.users[i] == self
    }
    if current_user != -1 && target_user_position != -1
      diff = target_user_position - current_user_position
      diff += room.number_of_players if diff < 0
      diff -= room.number_of_players if diff >= room.number_of_players
      case room.number_of_players
      when 2
        return :OPPONENT
      when 3
        case diff
        when 1
          return :LEFT_PERSON
        when 2
          return :RIGHT_PERSON
        end
      when 4
        case diff
        when 1
          return :FIRST_LEFT_PERSON
        when 2
          return :SECOND_LEFT_PERSON
        when 3
          return :THIRD_LEFT_PERSON
        end
      end
    end
    return :SOMEONE
  end

  private
    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token) unless self.ai_id
    end

end
