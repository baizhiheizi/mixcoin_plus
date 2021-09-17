# frozen_string_literal: true

module Markets::Arbitragable
  MINIMUM_TO_EXCHNAGE = 1 # USD
  MAXIMUM_TO_EXCHNAGE = 20 # USD
  SLIPPAGE_TO_EXCHANGE = 0.003
  OCEAN_TAKER_FEE_RATIO = 0.001

  def ocean_ask
    @ocean_ask ||=
      if ocean_book['asks'].last&.[]('funds').to_f * quote_asset.price_usd > MINIMUM_TO_EXCHNAGE
        ocean_book['asks'].first
      else
        ocean_book['asks'].second
      end
  end

  def ocean_bid
    @ocean_bid ||=
      if ocean_book['bids'].first&.[]('funds').to_f * quote_asset.price_usd > MINIMUM_TO_EXCHNAGE
        ocean_book['bids'].first
      else
        ocean_book['bids'].second
      end
  end

  def ocean_book
    @ocean_book ||= Ocean.api.book(ocean_market_id)&.[]('data')&.[]('data')
  end

  def buy_from_ocean
    return @buy_from_ocean if @buy_from_ocean.present?
    return if ocean_ask['funds'].to_f * quote_asset.price_usd < MINIMUM_TO_EXCHNAGE

    buying_price = ocean_ask['price'].to_f
    buying_funds = [ocean_ask['funds'].to_f, MAXIMUM_TO_EXCHNAGE].min
    buying_amount = (buying_funds / buying_price).floor(4)

    return if buying_amount.zero?

    buying_funds = (buying_amount * buying_price).round(8)

    @buy_from_ocean = {
      price: buying_price,
      amount: buying_amount,
      funds: buying_funds
    }
  end

  def sell_to_swap
    return @sell_to_swap if @sell_to_swap.present?

    selling_amount = (buy_from_ocean[:amount] * (1 - OCEAN_TAKER_FEE_RATIO)).floor(8)
    selling_funds = Foxswap.api.pre_order(
      pay_asset_id: base_asset_id,
      fill_asset_id: quote_asset_id,
      funds: selling_amount
    )&.[]('data')&.[]('fill_amount')&.to_f
    selling_price = (selling_funds / selling_amount).floor(8)

    @sell_to_swap = {
      price: selling_price,
      amount: selling_amount,
      funds: selling_funds
    }
  end

  def sell_to_ocean
    return @sell_to_ocean if @sell_to_ocean.present?
    return if ocean_bid['funds'].to_f * quote_asset.price_usd < MINIMUM_TO_EXCHNAGE

    selling_price = ocean_bid['price'].to_f
    selling_funds = [ocean_bid['funds'].to_f, MAXIMUM_TO_EXCHNAGE].min
    selling_amount = (selling_funds / selling_price).floor(4)

    return if selling_amount.zero?

    selling_funds = (selling_amount * selling_price).round(8)

    @sell_to_ocean = {
      price: selling_price,
      amount: selling_amount,
      funds: selling_funds
    }
  end

  def buy_from_swap
    return @buy_from_swap if @buy_from_swap.present?

    buying_funds = sell_to_ocean[:funds] * (1 - OCEAN_TAKER_FEE_RATIO).floor(8)
    buying_amount = Foxswap.api.pre_order(
      pay_asset_id: quote_asset_id,
      fill_asset_id: base_asset_id,
      funds: buying_funds
    )&.[]('data')&.[]('fill_amount')&.to_f
    buying_price = (buying_funds / buying_amount).floor(8)

    @buy_from_swap = {
      price: buying_price,
      amount: buying_amount,
      funds: buying_funds
    }
  end

  def patrol
    return if arbitraging?

    if ocean_ask.present? && ((sell_to_swap[:funds] * (1 - SLIPPAGE_TO_EXCHANGE)) - buy_from_ocean[:funds]).positive?
      arbitrage_orders.create!(
        arbitrager: Arbitrager.ready.take,
        arbitrager_id: Arbitrager.ready.sample&.mixin_uuid,
        raw: {
          ocean: {
            side: :bid
          }.merge(buy_from_ocean),
          swap: {
            side: :ask
          }.merge(sell_to_swap),
          expected_profit: (sell_to_swap[:funds] - buy_from_ocean[:funds]).floor(8),
          profit_asset_id: quote_asset_id
        }
      )
    elsif ocean_bid.present? && ((buy_from_swap[:amount] * (1 - SLIPPAGE_TO_EXCHANGE)) - (sell_to_ocean[:amount] * (1 - OCEAN_TAKER_FEE_RATIO))).positive?
      arbitrage_orders.create!(
        arbitrager: Arbitrager.ready.take,
        arbitrager_id: Arbitrager.ready.sample&.mixin_uuid,
        raw: {
          ocean: {
            side: :ask
          }.merge(sell_to_ocean),
          swap: {
            side: :bid
          }.merge(buy_from_swap),
          expected_profit: (buy_from_swap[:amount] - sell_to_ocean[:amount]).floor(8),
          profit_asset_id: base_asset_id
        }
      )
    else
      Rails.logger.info 'No arbitrage found'
    end
  rescue StandardError => e
    Rails.logger.error e.inspect
    raise e unless Rails.env.production?
  end

  def arbitraging?
    arbitrage_orders.arbitraging.present?
  end

  def patrol_async
    MarketArbitragePatrolWorker.perform_async id
  end
end
