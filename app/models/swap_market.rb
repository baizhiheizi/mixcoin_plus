# frozen_string_literal: true

class SwapMarket
  attr_accessor :base_asset_id, :quote_asset_id

  def initialize(base_asset_id:, quote_asset_id:)
    @base_asset_id = base_asset_id
    @quote_asset_id = quote_asset_id
  end

  def base_asset
    @base_asset ||= MixinAsset.find_by asset_id: base_asset_id
  end

  def quote_asset
    @quote_asset ||= MixinAsset.find_by asset_id: quote_asset_id
  end

  def ask_price
    _get_ask_price.present? ? _get_ask_price.to_f : _set_ask_price
  end

  def bid_price
    _get_bid_price.present? ? _get_bid_price.to_f : _set_bid_price
  end

  private

  def _get_ask_price
    Rails.cache.read(_ask_price_cache_id)
  end

  def _set_ask_price
    funds = base_asset.price_usd.positive? ? (50 / base_asset.price_usd).floor(8) : 1

    # amount = Foxswap.api.pre_order(
    #   pay_asset_id: base_asset_id,
    #   fill_asset_id: quote_asset_id,
    #   funds: funds
    # )&.[]('data')&.[]('fill_amount')&.to_f

    amount =
      begin
        pairs = Rails.cache.fetch 'pando_lake_routes', expires_in: 5.seconds do
          PandoBot::Lake.api.pairs['data']['pairs']
        end

        routes ||= PandoBot::Lake::PairRoutes.new pairs
        routes.pre_order(
          input_asset: base_asset_id,
          output_asset: quote_asset_id,
          input_amount: funds.to_d
        ).with_indifferent_access['amount'].to_f
      rescue StandardError => e
        Rails.logger.error e
        nil
      end

    _ask_price = (amount / funds).round(8) if amount&.positive?

    Rails.cache.write _ask_price_cache_id, _ask_price, expires_in: 1.minute

    _ask_price
  end

  def _ask_price_cache_id
    "ask_price_#{base_asset_id}_#{quote_asset_id}"
  end

  def _get_bid_price
    Rails.cache.read(_bid_price_cache_id)
  end

  def _set_bid_price
    funds = quote_asset.price_usd.positive? ? (50 / quote_asset.price_usd).floor(8) : 1

    # amount = Foxswap.api.pre_order(
    #   pay_asset_id: quote_asset_id,
    #   fill_asset_id: base_asset_id,
    #   funds: funds
    # )&.[]('data')&.[]('fill_amount')&.to_f

    amount =
      begin
        pairs = Rails.cache.fetch 'pando_lake_routes', expires_in: 5.seconds do
          PandoBot::Lake.api.pairs['data']['pairs']
        end

        routes ||= PandoBot::Lake::PairRoutes.new pairs
        routes.pre_order(
          input_asset: quote_asset_id,
          output_asset: base_asset_id,
          input_amount: funds.to_d
        ).with_indifferent_access['amount'].to_f
      rescue StandardError => e
        Rails.logger.error e
        nil
      end

    _bid_price = (funds / amount).round(8) if amount&.positive?

    Rails.cache.write _bid_price_cache_id, _bid_price, expires_in: 1.minute

    _bid_price
  end

  def _bid_price_cache_id
    "bid_price_#{quote_asset_id}_#{base_asset_id}"
  end
end
