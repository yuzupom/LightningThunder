class CreateDragonCards < ActiveRecord::Migration
  def change
    create_table :dragon_cards do |t|
      t.string :name
      t.string :short_word
      t.boolean :for_2_players
      t.boolean :for_3_players
      t.boolean :for_4_players
      t.string :main_text
      t.string :flavor_text
      t.integer :atk

      t.timestamps null: false
    end
  end
end
