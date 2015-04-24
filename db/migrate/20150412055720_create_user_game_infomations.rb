class CreateUserGameInfomations < ActiveRecord::Migration
  def change
    create_table :user_game_infomations do |t|
      t.integer :life
      t.integer :dragon_card_id
      t.integer :called_dragon_card_id
      t.boolean :finger_1st, default:false
      t.boolean :finger_2nd, default:false
      t.boolean :finger_3rd, default:false
      t.boolean :finger_4th, default:false
      t.boolean :finger_5th, default:false
      t.boolean :parent,     default:false
      t.boolean :posted_ok,  default:false
      t.boolean :successed_summon
      t.boolean :win_game
      t.integer :changed_life, default:0
      t.integer :user_id, index:true
      t.integer :rank
    end
  end
end
