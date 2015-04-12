json.array!(@users) do |user|
  json.extract! user, :id, :display_name, :win_count, :lose_count, :remember_token
  json.url user_url(user, format: :json)
end
