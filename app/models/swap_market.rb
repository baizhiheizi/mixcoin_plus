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
    get_ask_price.present? ? get_ask_price.to_f : set_ask_price
  end

  def bid_price
    get_bid_price.present? ? get_bid_price.to_f : set_bid_price
  end

  def get_ask_price
    Global.redis.get(_ask_price_cache_id)
  end

  def set_ask_price
    _ask_price ||= Foxswap.api.pre_order(
      pay_asset_id: base_asset_id,
      fill_asset_id: quote_asset_id,
      funds: 1
    )&.[]('data')&.[]('fill_amount')&.to_f

    Global.redis.set _ask_price_cache_id, _ask_price, ex: 1.minute

    _ask_price
  end

  def _ask_price_cache_id
    "ask_price_#{base_asset_id}_#{quote_asset_id}"
  end

  def get_bid_price
    Global.redis.get(_bid_price_cache_id)
  end

  def set_bid_price
    _bid_price ||= (1 / Foxswap.api.pre_order(
      pay_asset_id: quote_asset_id,
      fill_asset_id: base_asset_id,
      funds: 1
    )&.[]('data')&.[]('fill_amount')&.to_f)&.round(8)

    Global.redis.set _bid_price_cache_id, _bid_price, ex: 1.minute

    _bid_price
  end

  def _bid_price_cache_id
    "bid_price_#{base_asset_id}_#{quote_asset_id}"
  end
end
