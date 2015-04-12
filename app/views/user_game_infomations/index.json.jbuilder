json.array!(@user_game_infomations) do |user_game_infomation|
  json.extract! user_game_infomation, :id, :life, :dragon_card_id, :called_dragon_card_id, :finger_1st, :finger_2nd, :finger_3rd, :finger_4th, :finger_5th, :parent, :user_id, :ai_id
  json.url user_game_infomation_url(user_game_infomation, format: :json)
end
