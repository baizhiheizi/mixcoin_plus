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
  end

  def bid_price
  end
end
