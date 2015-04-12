class UserGameInfomation < ActiveRecord::Base
  belongs_to :user
  belongs_to :dragon_card

end
