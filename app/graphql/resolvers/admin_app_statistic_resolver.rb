# frozen_string_literal: true

module Resolvers
  class AdminAppStatisticResolver < Resolvers::AdminBaseResolver
    argument :scope, String, required: false

    type Types::AppStatisticType, null: false

    def resolve(**params)
      case params[:scope]
      when '24h'
        MixcoinPlusBot.app_statistic_24h
      else
        MixcoinPlusBot.app_statistic
      end
    end
  end
end
