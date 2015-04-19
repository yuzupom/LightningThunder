class RoomsController < ApplicationController

  def render_json(v)
    params={}
    params[:methods] = []
    params[:methods] << :room_status_name
#    params[:methods] << :room_status_names
    params[:methods] << :creater
    params[:methods] << :seated_users
    super v.to_json(params)
  end

  def index
    @rooms = Room.all
    render_json @rooms
  end

  def show
    return unless user_sign_in?
    return not_seated_error unless current_user.room
    render_json current_user.room
  end

  def not_seated_error
   render_error "you are not seated in any room"
  end

  def take_seat
    return unless user_is_correct?
    return render_error "room[id] is neccesary" if params[:room].blank? || params[:room][:id].blank?
    room = Room.find_by_id(params[:room][:id])
    return render_error "the room\##{params[:room][:id]} is not FOUND" unless room
    return render_error "the room\##{params[:room][:id]} does not have empty seat" unless room.has_empty_seat?
    return render_error "the room\##{params[:room][:id]} does not wait for more players" unless room.waits_more_players?
    current_user.update_attribute(:room_id, room.id)
    room = Room.find_by_id(params[:room][:id])
    room.updateStatus
    return render_json room
  end

  def leave_seat
    return unless user_sign_in?
    room = current_user.room
    return not_seated_error unless room
    return render_error "the room is already in game" if room.in_game?
    current_user.update_attribute(:room_id, nil)
    room.close if room.creater_id == current_user.id
    return render_json room
  end

  def create
    return unless user_is_correct?
    params[:room]={} if params[:room].blank?
    return render_error "set room[number_of_players] to 4" unless params[:room][:number_of_players]=="4"
    params[:room][:creater_id] = current_user.id if params[:room][:creater_id].blank?
    params[:room][:room_status_id] = 0
    @room = Room.new(room_params)
    if @room.save
      current_user.update_attribute(:room_id, @room.id)
      @room.update_attribute(:name, "room\##{@room.id}") if @room.name.blank?
      @room.updateStatus
      render_json @room
    else
      render_error @room.errors
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def room_params
      params.require(:room).permit(:creater_id, :name, :number_of_players, :room_status_id)
    end

    def user_is_correct?
      return unless user_sign_in?
      return render_error "you are now existing in a(nother) room" if current_user.entries?
      return true
    end

end