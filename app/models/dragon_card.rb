# encoding: utf-8
class DragonCard < ActiveRecord::Base
  has_many :user_game_infomations
  include Comparable

  def <=>(other)
    self.atk <=> other.atk
  end

  def success? my_finger,all_finger
    case self.short_name
    when :推理
      #TODO
      false
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
=begin
DragonCard.create(id:0, name:"雷竜の右腕　ルドベギア", short_word:"推理",for_2_players:true,for_3_players:true,for_4_players:true,atk:999999,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:1, name:"すごい弱いマン", short_word:"運命",for_2_players:true,for_3_players:true,for_4_players:true,atk:700000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:2, name:"無双マン", short_word:"無双",for_2_players:false,for_3_players:false,for_4_players:false,atk:600000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:3, name:"+1マン", short_word:"＋１",for_2_players:true,for_3_players:true,for_4_players:true,atk:400000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:4, name:"最大マン", short_word:"最大",for_2_players:true,for_3_players:true,for_4_players:true,atk:200000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:5, name:"可能性の生誕", short_word:"奇数",for_2_players:true,for_3_players:true,for_4_players:false,atk:500,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:6, name:"転卵", short_word:"なし",for_2_players:false,for_3_players:false,for_4_players:true,atk:100,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
=end

end