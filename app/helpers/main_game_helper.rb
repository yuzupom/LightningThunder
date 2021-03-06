module MainGameHelper
  include CpuHelper

  def startGame locked_room
    return false unless locked_room.in_begining_game?
    lock(locked_room) do
      prepareGame
      locked_room.updateStatusTo :PlayingGame
      startRound(locked_room)
    end
    return true
  end

  def checkTimeOut room
    return unless room.waits_for_lightning? || room.waits_for_dragon_name? || room.waits_for_ok?
    return if room.past_time < 45
    lock(room) do
      if room.waits_for_lightning?
        applyToUsers {|user| replaceIntoCPU(user,room) if user.finger.nil? }
        gotoDragonNamePhase room
      elsif room.waits_for_dragon_name?
        applyToUsers {|user| replaceIntoCPU(user,room) if user.user_game_infomation.dragon_card.short_name == :推理 }
        endRound room
      elsif room.waits_for_ok?
        applyToUsers {|user| user.user_game_infomation.update_attribute(:posted_ok,true) }
        postOK(room)
      end
      room.reload
      flg_player_exist = room.users.find{|user| user.ai_id.nil? }.nil?
      room.close unless flg_player_exist
    end



  end

  def applyToUsers
    @locked_room.users.each{|user|
      yield user
    }
    @locked_room.reload
  end


  def startRound locked_room
    lock(locked_room) do
      success = locked_room.updateStatusTo :PlayingGame_WaitingForLightning
      return false unless success
      resetStatus
      dealCard
      decideCPUFinger
    end
  end

  def postOK locked_room
    lock(locked_room) do
      flg_not_ok_yet = locked_room.users.find{|user| !user.user_game_infomation.posted_ok}.present?
      startRound locked_room unless flg_not_ok_yet
      return flg_not_ok_yet
    end
    return false
  end

  def gotoDragonNamePhase locked_room
    lock(locked_room) do
      return false unless locked_room.waits_for_lightning?
      success = locked_room.updateStatusTo :PlayingGame_WaitingForDragonName
      return false unless success
      flg_skip = true
      locked_room.users.each{|user|
        flg_suiri = user.user_game_infomation.dragon_card.short_name == :推理
        if flg_suiri && user.user_game_infomation.finger == 1
          if user.ai_id
            user.user_game_infomation.update_attribute(:called_dragon_card_id, decideCPUDragonName(user))
          else
            flg_skip = false
          end
          break
        end
      }
      if flg_skip
        endRound locked_room
      end
    end
    return true
  end

  def endRound locked_room
    return false unless locked_room.waits_for_dragon_name?
    lock(locked_room) do
      success = locked_room.updateStatusTo :PlayingGame_WaitingForOK
      return false unless success
      decideRank
      changeLife
      unless endsGame?
        turnParent
        npcCastOK
      end
    end
  end

  private
    def resetStatus
      @locked_room.users.each{|user|
        user.user_game_infomation.update_attributes(
          dragon_card_id: nil,
          called_dragon_card_id: nil,
          rank: nil,
          finger_1st: nil,
          finger_2nd: nil,
          finger_3rd: nil,
          finger_4th: nil,
          finger_5th: nil,
          successed_summon: nil,
          posted_ok: false,
          changed_life: 0
        )
      }
      @locked_room.reload
    end

    def turnParent
      case @locked_room.number_of_players
      when 2
        #TODO
      when 3
        #TODO
      when 4
        #nothing-to-do
      end
      @locked_room.reload
    end

    def endsGame?
      flg = @locked_room.users.each{|user|
        break false if user.user_game_infomation.life == 0
      }
      return false if flg
      @locked_room.users.each{|user|
        user.user_game_infomation.update_attribute(:win_game,user.user_game_infomation.life > 0)
      }
      @locked_room.reload
      closeGame
      return true
    end

    def closeGame
      @locked_room.updateStatusTo :EndingGame
      @locked_room.users.each{|user|
        counter = user.ai_id.blank?? nil : User.find_by(ai_id: user.ai_id)
        if user.user_game_infomation.win_game
          user   .update_attribute(:win_count,  user   .win_count  + 1)
          counter.update_attribute(:win_count,  counter.win_count  + 1) if counter
        else
          user   .update_attribute(:lose_count, user   .lose_count + 1)
          counter.update_attribute(:lose_count, counter.lose_count + 1) if counter
        end
      }
      @locked_room.reload
    end

    def changeLife
      required_rank = (@locked_room.number_of_players == 4)? 2 : 1
      losers = @locked_room.users.select{|user|
        user.user_game_infomation.rank.nil? || user.user_game_infomation.rank > required_rank
      }
      only_one_winner = begin
        if @locked_room.number_of_players > 2 && losers.length == @locked_room.number_of_players-1
          @locked_room.users.find{|user| user.user_game_infomation.rank==1}
        end
      end

      flg_LOVE_EGG = only_one_winner.present? &&
        only_one_winner.user_game_infomation.dragon_card.short_name == :奇数
      flg_VOID_EGG = only_one_winner.present? &&
        only_one_winner.user_game_infomation.dragon_card.short_name == :なし
      heal_life_point = 1
      lose_life_point = flg_VOID_EGG ? 2:1
      @locked_room.users.each{|user|
        life = user.user_game_infomation.life
        diff = 0
        if losers.include? user
          life = user.user_game_infomation.life - lose_life_point
          life = 0 if life < 0
        elsif only_one_winner == user
          life = (flg_LOVE_EGG)? 3 : only_one_winner.user_game_infomation.life + heal_life_point
          life = 4 if life > 4
        end
        diff = life - user.user_game_infomation.life
        user.user_game_infomation.update_attributes(life:life,changed_life:diff) if diff != 0
      }
      @locked_room.reload
    end

    def decideRank
      all_fingers = @locked_room.users.map{|user| user.finger}
      suceessed_users = @locked_room.users.select{|user|
        flg = user.user_game_infomation.dragon_card.success?(current_user,user,all_fingers)
        user.user_game_infomation.update_attribute(:successed_summon, flg)
        flg
      }
      suceessed_users.sort!{|a,b|
        b.user_game_infomation.dragon_card <=> a.user_game_infomation.dragon_card
      }
      suceessed_users.length.times{|i|
        suceessed_users[i].user_game_infomation.update_attribute(:rank, (i+1))
      }
      @locked_room.reload
    end

    def dragons_id players
      case players
      when (2..3)
        [0,1,3,4,5]
      when 4
        [0,1,2,3,4,6]
      end
    end


    def prepareGame
      @locked_room.users.each{|user|
        params = {life: 4, user_id: user.id}
        if user.user_game_infomation
          user.user_game_infomation.update_attributes params
        else
          UserGameInfomation.create params
        end
      }
      if @locked_room.number_of_players === (2..3)
        @locked_room.users[rand(@locked_room.number_of_players)].user_game_infomation.update_attribute(:parent, true)
      end
      @locked_room.reload
    end

    def dealCard_4
      array = dragons_id(4).shuffle
      4.times{|i|
        @locked_room.users[i].user_game_infomation.update_attribute(:dragon_card_id, array[i])
      }
    end

    def dealCard
      case @locked_room.number_of_players
      when 2
        #TODO
      when 3
        #TODO
      when 4
        dealCard_4
      end
      @locked_room.reload
    end

    def lock room
      @locked_room = room
      yield
      resetTime if @locked_room
      @locked_room = nil
    end

    def resetTime
      @locked_room.touch
    end

    def replaceIntoCPU user,room
      new_cpu = room.makeCPU [1,2].sample
      user.update_attribute(:room_id, nil)
      user.user_game_infomation.update_attribute(:user_id, new_cpu.id)
      user.reload
      new_cpu.reload
      if room.waits_for_lightning?
        new_cpu.saveFingers(cpu_fingers(new_cpu))
      elsif room.waits_for_dragon_name?
        new_cpu.user_game_infomation.update_attribute(:called_dragon_card_id, decideCPUDragonName(new_cpu))
      end
    end


end
