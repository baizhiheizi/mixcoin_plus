# frozen_string_literal: true

module Resolvers
  class AdminPaymentConnectionResolver < Resolvers::AdminBaseResolver
    argument :after, String, required: false

    type Types::PaymentType.connection_type, null: false

    def resolve(*)
      Payment.all
    end
  end
end
