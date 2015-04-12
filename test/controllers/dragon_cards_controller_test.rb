require 'test_helper'

class DragonCardsControllerTest < ActionController::TestCase
  setup do
    @dragon_card = dragon_cards(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:dragon_cards)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create dragon_card" do
    assert_difference('DragonCard.count') do
      post :create, dragon_card: { flavor_text: @dragon_card.flavor_text, for_2_players: @dragon_card.for_2_players, for_3_players: @dragon_card.for_3_players, for_4_players: @dragon_card.for_4_players, main_text: @dragon_card.main_text, name: @dragon_card.name, short_word: @dragon_card.short_word }
    end

    assert_redirected_to dragon_card_path(assigns(:dragon_card))
  end

  test "should show dragon_card" do
    get :show, id: @dragon_card
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @dragon_card
    assert_response :success
  end

  test "should update dragon_card" do
    patch :update, id: @dragon_card, dragon_card: { flavor_text: @dragon_card.flavor_text, for_2_players: @dragon_card.for_2_players, for_3_players: @dragon_card.for_3_players, for_4_players: @dragon_card.for_4_players, main_text: @dragon_card.main_text, name: @dragon_card.name, short_word: @dragon_card.short_word }
    assert_redirected_to dragon_card_path(assigns(:dragon_card))
  end

  test "should destroy dragon_card" do
    assert_difference('DragonCard.count', -1) do
      delete :destroy, id: @dragon_card
    end

    assert_redirected_to dragon_cards_path
  end
end
