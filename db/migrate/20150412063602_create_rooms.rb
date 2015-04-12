class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.integer :room_status_id
      t.string :name
      t.integer :number_of_players

      t.timestamps null: false
    end

    create_table :room_statuses do |t|
      t.string :name
    end
  end
end
