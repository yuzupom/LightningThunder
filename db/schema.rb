# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150412063602) do

  create_table "dragon_cards", force: :cascade do |t|
    t.string  "name"
    t.string  "short_word"
    t.boolean "for_2_players"
    t.boolean "for_3_players"
    t.boolean "for_4_players"
    t.string  "main_text"
    t.string  "flavor_text"
    t.integer "atk"
  end

  create_table "room_statuses", force: :cascade do |t|
    t.string "name"
  end

  create_table "rooms", force: :cascade do |t|
    t.integer  "creater_id"
    t.integer  "room_status_id"
    t.string   "name"
    t.integer  "number_of_players"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "rooms", ["creater_id"], name: "index_rooms_on_creater_id"

  create_table "user_game_infomations", force: :cascade do |t|
    t.integer "life"
    t.integer "dragon_card_id"
    t.integer "called_dragon_card_id"
    t.boolean "finger_1st",            default: false
    t.boolean "finger_2nd",            default: false
    t.boolean "finger_3rd",            default: false
    t.boolean "finger_4th",            default: false
    t.boolean "finger_5th",            default: false
    t.boolean "parent",                default: false
    t.boolean "posted_ok",             default: false
    t.boolean "successed_summon"
    t.boolean "win_game"
    t.integer "changed_life",          default: 0
    t.integer "user_id"
    t.integer "rank"
  end

  add_index "user_game_infomations", ["user_id"], name: "index_user_game_infomations_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "display_name"
    t.integer  "room_id"
    t.integer  "win_count",      default: 0
    t.integer  "lose_count",     default: 0
    t.string   "remember_token"
    t.integer  "ai_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

end
