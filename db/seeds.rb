DragonCard.create(id:0, name:"雷竜の右腕　ルドベギア", short_word:"推理",
    for_2_players:true,
    for_3_players:true,
    for_4_players:true,
    atk:999999,main_text:"面倒だから放置",flavor_text:"面倒だから放置"
  )
DragonCard.create(id:1, name:"常勝帝　VR・リンドウ", short_word:"運命",
    for_2_players:true,
    for_3_players:true,
    for_4_players:true,
    atk:700000,main_text:"面倒だから放置",flavor_text:"面倒だから放置"
  )
DragonCard.create(id:2, name:"真実詠み　ギャリー・マ・エイビス", short_word:"無双",
    for_2_players:false,
    for_3_players:false,
    for_4_players:true,
    atk:600000,main_text:"面倒だから放置",flavor_text:"面倒だから放置"
  )
DragonCard.create(id:3, name:"彼岸の侵略者　イフェイオン", short_word:"＋１",
    for_2_players:true,
    for_3_players:true,
    for_4_players:true,
    atk:400000,main_text:"面倒だから放置",flavor_text:""
  )
DragonCard.create(id:4, name:"響き渡る怒号　ア・コニタム", short_word:"最大",
    for_2_players:true,
    for_3_players:true,
    for_4_players:true,
    atk:200000,main_text:"面倒だから放置",flavor_text:"面倒だから放置"
  )
DragonCard.create(id:5, name:"可能性の生誕", short_word:"奇数",
    for_2_players:true,
    for_3_players:true,
    for_4_players:false,
    atk:500,main_text:"面倒だから放置",flavor_text:"面倒だから放置"
  )
DragonCard.create(id:6, name:"転卵", short_word:"なし",
    for_2_players:false,
    for_3_players:false,
    for_4_players:true,
    atk:100,main_text:"面倒だから放置",flavor_text:"面倒だから放置"
  )

ai_ids=(1..20)
ai_ids.each{|id|
  User.create(:display_name => "CPU_Rate_Count\##{id}", :ai_id => id)
}
Room.room_statuses.each{|k,v|
  RoomStatus.create(id:k,name:v)
}
