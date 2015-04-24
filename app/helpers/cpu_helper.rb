module CpuHelper
  require 'csv'

  def decideCPUFinger
    @locked_room.users.each{|cpu|
      next unless cpu.ai_id
      cpu.saveFingers(cpu_fingers)
    }
    @locked_room.reload
  end

  def npcCastOK
    @locked_room.users.each{|cpu|
      next unless cpu.ai_id
      cpu.user_game_infomation.update_attribute(:posted_ok,true)
    }
    @locked_room.reload
  end

  def decideCPUDragonName
    #read cpu ai from csv
    return 1
  end

  def cpu_fingers
    #read cpu ai from csv
    return 5
  end


end