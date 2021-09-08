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
    Global.redis.get(_ask_price_cache_id)
  end

  def _set_ask_price
    funds = base_asset.price_usd.positive? ? (50 / base_asset.price_usd).floor(8) : 1

    amount = Foxswap.api.pre_order(
      pay_asset_id: base_asset_id,
      fill_asset_id: quote_asset_id,
      funds: funds
    )&.[]('data')&.[]('fill_amount')&.to_f

    _ask_price = (amount / funds).round(8) if amount.positive?

    Global.redis.set _ask_price_cache_id, _ask_price, ex: 1.minute

    _ask_price
  end

  def _ask_price_cache_id
    "price_#{base_asset_id}_#{quote_asset_id}"
  end

  def _get_bid_price
    Global.redis.get(_bid_price_cache_id)
  end

  def _set_bid_price
    funds = quote_asset.price_usd.positive? ? (50 / quote_asset.price_usd).floor(8) : 1

    amount = Foxswap.api.pre_order(
      pay_asset_id: quote_asset_id,
      fill_asset_id: base_asset_id,
      funds: funds
    )&.[]('data')&.[]('fill_amount')&.to_f

    _bid_price = (funds / amount).round(8) if amount.positive?

    Global.redis.set _bid_price_cache_id, _bid_price, ex: 1.minute

    _bid_price
  end

  def _bid_price_cache_id
    "price_#{quote_asset_id}_#{base_asset_id}"
  end
end
