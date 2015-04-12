class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :display_name
      t.integer :room_id
      t.integer :win_count, default:0
      t.integer :lose_count, default:0
      t.string :remember_token

      t.timestamps null: false
    end
  end
end
