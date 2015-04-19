class Room < ActiveRecord::Base
  has_many:users
  validates :creater_id, presence: true
  validates :number_of_players, presence: true

  def has_empty_seat?
    self.users.length < self.number_of_players
  end

  def in_game?
    sym = self.room_status_name.to_sym
    return :BeginingGame == sym || :PlayingGame == sym
  end

  def waits_more_players?
    return false unless has_empty_seat?
    return :WaitingForPlayers == self.room_status_name.to_sym
  end

  def creater
    return nil unless self.creater_id
    u = User.find_by_id(self.creater_id)
    return nil unless u
    u.to_h(except:["remember_token","room_id"])
  end

  def seated_users
    self.users.to_a.map{|user| user.to_h(except:["remember_token","room_id"]) }
  end

  def room_status_names
    return @room_status_names if @room_status_names
    @room_status_names = Room.room_statuses.map{|k,v| v}
  end

  def room_status_name
    Room.room_statuses[self.room_status_id]
  end

  @@room_statuses = nil
  def Room.room_statuses
    return @@room_statuses if @@room_statuses
    @@room_statuses = {}
    @@room_statuses[  0] = :CreatingRoom
    @@room_statuses[ 10] = :WaitingForPlayers
    @@room_statuses[ 20] = :BeginingGame
    @@room_statuses[ 30] = :PlayingGame
    @@room_statuses[ 40] = :EndingGame
    @@room_statuses[ 50] = :Closed
    @@room_statuses[400] = :Error
    @@room_statuses
  end

  def close
    self.update_attribute(:room_status_id, 50)
    self.users.each{|user|
      user.update_attribute(:room_id, nil)
    }
  end

  def updateStatus
    #TODO mutex lock
    case Room.room_statuses[self.room_status_id]
    when :CreatingRoom
      self.update_attribute(:room_status_id, 10)
    when :WaitingForPlayers
      if self.users.length == self.number_of_players
        self.update_attribute(:room_status_id, 20)
      elsif self.users.length > self.number_of_players
        self.update_attribute(:room_status_id, 400)
      end
    when :BeginingGame
    when :PlayingGame
    when :EndingGame
    when :Closed
    when :Error
    end
  end

end
