DragonCard.create(id:0, name:"雷竜の右腕　ルドベギア", short_word:"推理",for_2_players:true,for_3_players:true,for_4_players:true,atk:999999,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:1, name:"すごい弱いマン", short_word:"運命",for_2_players:true,for_3_players:true,for_4_players:true,atk:700000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:2, name:"無双マン", short_word:"無双",for_2_players:false,for_3_players:false,for_4_players:false,atk:600000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:3, name:"+1マン", short_word:"＋１",for_2_players:true,for_3_players:true,for_4_players:true,atk:400000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:4, name:"最大マン", short_word:"最大",for_2_players:true,for_3_players:true,for_4_players:true,atk:200000,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:5, name:"可能性の生誕", short_word:"奇数",for_2_players:true,for_3_players:true,for_4_players:false,atk:500,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")
DragonCard.create(id:6, name:"転卵", short_word:"なし",for_2_players:false,for_3_players:false,for_4_players:true,atk:100,main_text:"面倒だからしばらく放置",flavor_text:"面倒だからしばらく放置")

Room.room_statuses.each{|k,v|
  RoomStatus.create(id:k,name:v)
}
