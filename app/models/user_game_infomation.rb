class UserGameInfomation < ActiveRecord::Base
  belongs_to :user
  belongs_to :dragon_card

  def to_h(position)
    h = {position:position,life:life,parent:parent}
    h[:finger_ready] = finger.present?
    flgs_hidden = {detail:true, finger:true, dragon:true}
    case position
    when :YOU
      flgs_hidden[:detail] = false
      flgs_hidden[:finger] = false
      flgs_hidden[:dragon] = false
    else
    #when :FIRST_LEFT_PERSON || :SECOND_LEFT_PERSON || :THIRD_LEFT_PERSON
      case user.room.room_status_name
      when :PlayingGame_WaitingForLightning
        flgs_hidden[:dragon] = false if position == :FIRST_LEFT_PERSON
      when :PlayingGame_WaitingForDragonName
        flgs_hidden[:dragon] = false if position == :FIRST_LEFT_PERSON
        flgs_hidden[:finger] = false
      else
        flgs_hidden[:finger] = false
        flgs_hidden[:dragon] = false
        flgs_hidden[:detail] = false
      end
    end
    hidden = "-hidden-"
    h[:finger] = flgs_hidden[:finger]? hidden : finger_s
    h[:dragon] = flgs_hidden[:dragon]? hidden : dragon_card
    h[:detail] = flgs_hidden[:detail]? hidden : detail
    h
  end

  def finger_s
    finger.present?? finger : "NOT-DECIDED"
  end

  def detail
    h = attributes
    h.delete("id")
    h.delete("user_id")
    h.delete("life")
    h.delete("parent")
    h.delete("dragon_card_id")
    h
  end

  def finger
    arr = [
      self.finger_1st,
      self.finger_2nd,
      self.finger_3rd,
      self.finger_4th,
      self.finger_5th
    ]
    i = 0; flg_nil = false
    arr.each{|flg|
      break flg_nil = true if flg.nil?
      i += 1 if flg
    }
    return (flg_nil)? nil : i
  end


end
