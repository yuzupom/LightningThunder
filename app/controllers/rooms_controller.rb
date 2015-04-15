class RoomsController < ApplicationController
  before_action :set_room, only: [:show, :edit, :update, :destroy]

  def index
    @rooms = Room.all
    render_json @rooms
  end

  def render_json(v)
    params={}
    params[:methods] = []
    params[:methods] << :room_status_name
    params[:methods] << :room_status_names
    params[:methods] << :creater
    params[:methods] << :entried_users
    super v.to_json(params)
  end

  def show
  end

  def create
    return render_error "not signed_in yet" unless sign_in?
    return render_error "set number_of_players to 4" unless params[:room][:number_of_players]=="4"
    params[:room]={} if params[:room].blank?
    params[:room][:creater_id] = current_user.id if params[:room][:creater_id].blank?
    params[:room][:room_status_id] = 0
    @room = Room.new(room_params)
    if @room.save
      current_user.update_attribute(:room_id, @room.id)
      @room.update_attribute(:name, "room\##{@room.id}") if @room.name.blank?
      @room.update_attribute(:room_status_id, 10) if @room.room_status_id.blank?
      render_json @room
    else
      render_error @room.errors
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room
      @room = Room.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def room_params
      params.require(:room).permit(:creater_id, :name, :number_of_players)
    end
end