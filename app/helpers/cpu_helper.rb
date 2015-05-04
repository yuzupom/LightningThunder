#encoding:utf-8
module CpuHelper
  require 'csv'

  def decideCPUFinger
    @locked_room.users.each{|cpu|
      next unless cpu.ai_id
      cpu.saveFingers(cpu_fingers cpu)
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

  def decideCPUDragonName cpu
    #read cpu ai from csv
    return 1
  end

  def cpu_fingers cpu
    dragon_id_a = dragons_id 4
    left_dragon_id = cpu.left_person.user_game_infomation.dragon_card_id

    csv =
      case cpu.ai_id
      when 1
        弱い cpu
      when 2
        強い cpu
      else
        return 5
      end
    hash = {}
    sum = 0
    arr = csv[dragon_id_a.find_index(left_dragon_id)]
    6.times{|i|
      num = arr[i].to_i
      hash[i] = num
      sum    += num
    }
    r = rand(sum)
    tracer = 0
    hash.find{|k,v|
      tracer += v
      return k if r < tracer
    }
  end

  private
    def file_name_a
      ["suiri","unmei","musou","plus1","saidai","kisuu","nasi",]
    end

    def file_name folder, child, id
      "db/cpu/#{folder}/#{child}/#{file_name_a[id]+child}.csv"
    end

    def 弱い cpu
      csv_read(file_name("weaker", "E" , cpu.user_game_infomation.dragon_card_id))
    end

    def 強い cpu
      cpu_life   = cpu.user_game_infomation.life
      left_life  = cpu.left_person.user_game_infomation.life + 2
      lifes_x_me = cpu.room.users.map{|user| user.user_game_infomation.life}.compact
      child =
        if cpu_life >= left_life + 2
          "D"
        elsif cpu_life >= lifes_x_me.min + 2
          "C"
        elsif cpu_life <= lifes_x_me.min
          "B"
        else
          "A"
        end
      csv_read(file_name("stronger", child , cpu.user_game_infomation.dragon_card_id))
    end

    @@csv_a = {}
    def csv_read file
      return @@csv_a[file] if @@csv_a[file]
      @@csv_a[file] = CSV.read(file)
    end


end


