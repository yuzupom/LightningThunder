# encoding: utf-8
class DragonCard < ActiveRecord::Base
  include Comparable

  def <=>(other)
    self.atk <=> other.atk
  end

  def success? current_user,me,all_finger
    my_finger = me.finger
    case self.short_name
    when :推理
      if my_finger == 1
        right_card_id = me.right_person.user_game_infomation.dragon_card_id
        me.user_game_infomation.called_dragon_card_id == right_card_id
      else
        false
      end
    when :運命
      map = {0=>2,2=>5,5=>0}
      all_finger.include? (map[my_finger])
    when :無双
      all_finger.count(my_finger) == 1
    when :＋１
      target_number = my_finger==0? 5 : my_finger - 1
      all_finger.include? target_number
    when :最大
      my_finger == all_finger.max
    when :奇数
      my_finger % 2 == 1
    when :なし
      true
    else
      false
    end
  end

  def short_name
    case self.id
    when 0 then :推理
    when 1 then :運命
    when 2 then :無双
    when 3 then :＋１
    when 4 then :最大
    when 5 then :奇数
    when 6 then :なし
    end
  end
end