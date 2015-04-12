json.array!(@rooms) do |room|
  json.extract! room, :id, :status_id, :name, :number_of_players
  json.url room_url(room, format: :json)
end
