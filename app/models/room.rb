class Room < ActiveRecord::Base
  has_many:users
  validates :creater_id, presence: true
  validates :number_of_players, presence: true

  def to_h current_user
    detail = self.attributes
    h = {
        name: detail.delete("name"),
        number_of_players: detail.delete("number_of_players"),
        room_status_name:room_status_name,
        #creater:creater,
        seated_users:seated_users(current_user),
        detail:detail
      }
  end

  def seated_users current_user
    self.users.to_a.map{|user|
      user.to_h(current_user:current_user, except:["remember_token","room_id"])
    }
  end

  def has_empty_seat?
    self.users.length < self.number_of_players
  end

  def waits_for_lightning?
    sym = self.room_status_name.to_sym
    return :PlayingGame_WaitingForLightning == sym
  end

  def waits_for_dragon_name?
    sym = self.room_status_name.to_sym
    return :PlayingGame_WaitingForDragonName == sym
  end

  def waits_for_ok?
    sym = self.room_status_name.to_sym
    return :PlayingGame_WaitingForOK == sym
  end

  def in_game?
    sym = self.room_status_name.to_sym
    return [
        :BeginingGame,
        :PlayingGame,
        :PlayingGame_WaitingForLightning,
        :PlayingGame_WaitingForDragonName,
        :PlayingGame_WaitingForOK
      ].include? sym
  end

  def in_begining_game?
    sym = self.room_status_name.to_sym
    return :BeginingGame == sym
  end

  def game_over?
    sym = self.room_status_name.to_sym
    return :EndingGame == sym || :Closed == sym
  end

  def waits_more_players?
    return false unless has_empty_seat?
    return :WaitingForPlayers == self.room_status_name.to_sym
  end
=begin
  def creater
    return nil unless self.creater_id
    u = User.find_by_id(self.creater_id)
    return nil unless u
    {id: u.id,display_name: u.display_name}
  end
=end
  def room_status_names
    return @room_status_names if @room_status_names
    @room_status_names = Room.room_statuses.map{|k,v| v}
  end

  def room_status_name
    Room.room_statuses[self.room_status_id]
  end

  def close
    self.update_attribute(:room_status_id, 50)
    self.users.each{|user|
      user.user_game_infomation.destroy
      if user.ai_id
        user.destroy
      else
        user.update_attribute(:room_id, nil)
      end
    }
  end

  def updateStatusTo(status_symbol)
    flg_no_increase = Room.room_statuses[status_symbol] <= self.room_status_id
    return false if flg_no_increase && status_symbol != :PlayingGame_WaitingForLightning
    case status_symbol
      when :WaitingForPlayers
      when :BeginingGame
        if self.users.length != self.number_of_players
          return false
        elsif self.users.length > self.number_of_players
          self.update_attribute(:room_status_id, 400)
          return false
        else
          #ok
        end
      when :PlayingGame
      when :PlayingGame_WaitingForLightning
        return false if flg_no_increase && !waits_for_ok?
      when :PlayingGame_WaitingForDragonName
        return false unless self.users.each{|user| break false if user.finger.nil? }
      when :PlayingGame_WaitingForOK
      when :EndingGame
      when :Closed
      when :Error
    end
    self.update_attribute(:room_status_id, Room.room_statuses[status_symbol])
    return true
  end

  @@room_statuses = nil
  def Room.room_statuses
    return @@room_statuses if @@room_statuses
    arr = [
      [  0, :CreatingRoom],
      [ 10, :WaitingForPlayers],
      [ 20, :BeginingGame],
      [ 30, :PlayingGame],
      [ 32, :PlayingGame_WaitingForLightning],
      [ 35, :PlayingGame_WaitingForDragonName],
      [ 37, :PlayingGame_WaitingForOK],
      [ 40, :EndingGame],
      [ 50, :Closed],
      [400, :Error]
    ]
    @@room_statuses = {}
    arr.each do |k,v|
      @@room_statuses[k] = v
      @@room_statuses[v] = k
    end
    @@room_statuses
  end

  private

end
