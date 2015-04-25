class DragonCardsController < ApplicationController
  def index
    render_json DragonCard.all
  end
end
