class RoomsController < ApplicationController
  include MainGameHelper

  def render_json(v)
    if v.kind_of? ActiveRecord::Relation
      super v.map{|room|
        room.to_h(current_user)
      }
    else
      v.with_lock do
        checkTimeOut v
      end
      super v.reload.to_h(current_user)
    end
  end

  def cast_name
    return unless user_sign_in?
    return render_error "cast is neccesary" if params[:cast].blank?
    room = current_user.room
    return not_seated_error unless room
    room.with_lock do
      return render_error "the room is not in game" unless room.in_game?
      return render_error "the room is not waiting for cast NAME" unless room.waits_for_dragon_name?
      return render_error "you do not have 雷竜の右腕　ルドベギア (you have #{current_user.user_game_infomation.dragon_card.short_name})" if current_user.user_game_infomation.dragon_card.short_name != :推理
      current_user.user_game_infomation.update_attribute(:called_dragon_card_id, params[:cast].to_i)
      endRound room.reload
      return render_json room.reload
    end

  end

  def cast_finger
    return unless user_sign_in?
    return render_error "cast is neccesary" if params[:cast].blank?
    room = current_user.room
    return not_seated_error unless room
    room.with_lock do
      return render_error "the room is not in game" unless room.in_game?
      return render_error "the room is not waiting for cast finger" unless room.waits_for_lightning?
      current_user.saveFingers(params[:cast])
      gotoDragonNamePhase room.reload
      return render_json room.reload
    end
  end

  def cast_ok
    return unless user_sign_in?
    room = current_user.room
    return not_seated_error unless room
    room.with_lock do
      return render_error "the room is not in game" unless room.in_game?
      return render_error "the room is not waiting for OK" unless room.waits_for_ok?
      current_user.user_game_infomation.update_attribute(:posted_ok,true)
      postOK(room)
      return render_json room.reload
    end
  end

  def game_start cpus=[]
    return unless user_sign_in?
    room = current_user.room
    return not_seated_error unless room
    room.with_lock do
      return render_error "the room\##{room.id} does not wait for more players" unless room.waits_more_players?
      return render_error "the room\##{room.id} does not have empty seat" unless room.has_empty_seat?
      room.makeCPUS cpus
      room.reload
      room.updateStatusTo :BeginingGame
      success = startGame(room)
      room.updateStatusTo :Error unless success
      return render_json room
    end
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

  def take_seat
    return unless user_is_correct?
    return render_error "room[id] is neccesary" if params[:room].blank? || params[:room][:id].blank?
    room = Room.find_by_id(params[:room][:id])
    return render_error "the room\##{params[:room][:id]} is not FOUND" unless room
    room.with_lock do
      return render_error "the room\##{params[:room][:id]} does not have empty seat" unless room.has_empty_seat?
      return render_error "the room\##{room.id} does not wait for more players" unless room.waits_more_players?
      return render_error "the room\##{params[:room][:id]} does not wait for more players" unless room.waits_more_players?
      current_user.update_attribute(:room_id, room.id)
      room.reload
      success = room.updateStatusTo :BeginingGame
      startGame(room) if success
      return render_json room.reload
    end
  end

  def leave_seat
    return unless user_sign_in?
    room = current_user.room
    return not_seated_error unless room
    room.with_lock do
      return render_error "the room is already in game" if room.in_game?
      current_user.update_attribute(:room_id, nil)
      room.close if room.creater_id == current_user.id
      return render_json room.reload
    end
  end

  def create
    return unless user_is_correct?
    params[:room]={} if params[:room].blank?
    return render_error "set room[number_of_players] to 4" unless params[:room][:number_of_players]=="4"
    params[:room][:creater_id] = current_user.id if params[:room][:creater_id].blank?
    params[:room][:room_status_id] = 0
    @room = Room.new(room_params)
    @room.with_lock do
      if @room.save
        current_user.update_attribute(:room_id, @room.id)
        @room.update_attribute(:name, "room\##{@room.id}") if @room.name.blank?
        @room.updateStatusTo :WaitingForPlayers
        render_json @room
      else
        render_error @room.errors
      end
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

    def not_seated_error
     render_error "you are not seated in any room"
    end


end