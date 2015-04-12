require 'test_helper'

class UserGameInfomationsControllerTest < ActionController::TestCase
  setup do
    @user_game_infomation = user_game_infomations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_game_infomations)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_game_infomation" do
    assert_difference('UserGameInfomation.count') do
      post :create, user_game_infomation: { ai_id: @user_game_infomation.ai_id, called_dragon_card_id: @user_game_infomation.called_dragon_card_id, dragon_card_id: @user_game_infomation.dragon_card_id, finger_1st: @user_game_infomation.finger_1st, finger_2nd: @user_game_infomation.finger_2nd, finger_3rd: @user_game_infomation.finger_3rd, finger_4th: @user_game_infomation.finger_4th, finger_5th: @user_game_infomation.finger_5th, life: @user_game_infomation.life, parent: @user_game_infomation.parent, user_id: @user_game_infomation.user_id }
    end

    assert_redirected_to user_game_infomation_path(assigns(:user_game_infomation))
  end

  test "should show user_game_infomation" do
    get :show, id: @user_game_infomation
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_game_infomation
    assert_response :success
  end

  test "should update user_game_infomation" do
    patch :update, id: @user_game_infomation, user_game_infomation: { ai_id: @user_game_infomation.ai_id, called_dragon_card_id: @user_game_infomation.called_dragon_card_id, dragon_card_id: @user_game_infomation.dragon_card_id, finger_1st: @user_game_infomation.finger_1st, finger_2nd: @user_game_infomation.finger_2nd, finger_3rd: @user_game_infomation.finger_3rd, finger_4th: @user_game_infomation.finger_4th, finger_5th: @user_game_infomation.finger_5th, life: @user_game_infomation.life, parent: @user_game_infomation.parent, user_id: @user_game_infomation.user_id }
    assert_redirected_to user_game_infomation_path(assigns(:user_game_infomation))
  end

  test "should destroy user_game_infomation" do
    assert_difference('UserGameInfomation.count', -1) do
      delete :destroy, id: @user_game_infomation
    end

    assert_redirected_to user_game_infomations_path
  end
end
