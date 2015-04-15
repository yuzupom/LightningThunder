class Room < ActiveRecord::Base
  has_many:users

  def creater
    User.find(self.creater_id)
  end

  def room_status_names
    return @room_status_names if @room_status_names
    @room_status_names = room_statuses.map{|k,v| v}
  end

  def room_status_name
    room_statuses[self.room_status_id]
  end

  def room_statuses
    return @room_statuses if @room_statuses
    @room_statuses = RoomStatus.all.map{|i| [i.id, i.name]}.to_h
  end

end
