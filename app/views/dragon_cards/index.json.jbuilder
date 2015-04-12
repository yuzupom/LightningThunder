json.array!(@dragon_cards) do |dragon_card|
  json.extract! dragon_card, :id, :name, :short_word, :for_2_players, :for_3_players, :for_4_players, :main_text, :flavor_text
  json.url dragon_card_url(dragon_card, format: :json)
end
