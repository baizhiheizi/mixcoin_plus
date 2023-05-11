# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_05_09_010233) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "actions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "action_type", null: false
    t.string "action_option"
    t.string "target_type"
    t.uuid "target_id"
    t.string "user_type"
    t.uuid "user_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["action_type", "target_type", "target_id", "user_type", "user_id"], name: "uk_action_target_user", unique: true
    t.index ["target_type", "target_id", "action_type"], name: "index_actions_on_target_type_and_target_id_and_action_type"
    t.index ["user_type", "user_id", "action_type"], name: "index_actions_on_user_type_and_user_id_and_action_type"
  end

  create_table "administrators", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_administrators_on_name", unique: true
  end

  create_table "applet_actions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "applet_id", null: false
    t.string "type"
    t.jsonb "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["applet_id"], name: "index_applet_actions_on_applet_id"
  end

  create_table "applet_activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "applet_action_id", null: false
    t.string "state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "applet_id"
    t.json "snapshot"
    t.index ["applet_action_id"], name: "index_applet_activities_on_applet_action_id"
    t.index ["applet_id"], name: "index_applet_activities_on_applet_id"
  end

  create_table "applet_triggers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "applet_id", null: false
    t.string "type"
    t.jsonb "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["applet_id"], name: "index_applet_triggers_on_applet_id"
  end

  create_table "applets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "title"
    t.boolean "connected", default: false
    t.datetime "last_active_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at", precision: nil
    t.integer "applet_activities_count", default: 0
    t.string "state"
    t.string "type"
  end

  create_table "arbitrage_orders", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "market_id"
    t.uuid "arbitrager_id"
    t.string "state"
    t.json "raw"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "base_asset_profit", default: 0.0
    t.float "quote_asset_profit", default: 0.0
    t.index ["arbitrager_id"], name: "index_arbitrage_orders_on_arbitrager_id"
    t.index ["market_id"], name: "index_arbitrage_orders_on_market_id"
  end

  create_table "booking_order_activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "market_id"
    t.datetime "started_at", precision: nil
    t.datetime "ended_at", precision: nil
    t.float "scores_total"
    t.float "bonus_total"
    t.uuid "bonus_asset_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "traded_amount"
    t.float "traded_funds"
    t.float "avg_funds"
    t.integer "participants_count"
    t.index ["market_id"], name: "index_booking_order_activities_on_market_id"
  end

  create_table "booking_order_activity_participants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "booking_order_activity_id"
    t.float "scores"
    t.float "bonus", default: 0.0
    t.uuid "bonus_asset_id"
    t.string "state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_order_activity_id"], name: "participants_on_booking_order_activities_fk"
    t.index ["user_id"], name: "index_booking_order_activity_participants_on_user_id"
  end

  create_table "booking_order_snapshots", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "market_id"
    t.uuid "user_id"
    t.uuid "ocean_order_id"
    t.float "ticker"
    t.float "funds"
    t.float "price"
    t.float "scores"
    t.float "order_weight"
    t.json "snapshot"
    t.integer "timestamp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["market_id"], name: "index_booking_order_snapshots_on_market_id"
    t.index ["ocean_order_id"], name: "index_booking_order_snapshots_on_ocean_order_id"
    t.index ["user_id"], name: "index_booking_order_snapshots_on_user_id"
  end

  create_table "exception_tracks", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "group_markets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "market_id", null: false
    t.uuid "mixin_conversation_id", null: false
    t.integer "rank"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["market_id"], name: "index_group_markets_on_market_id"
    t.index ["mixin_conversation_id"], name: "index_group_markets_on_mixin_conversation_id"
  end

  create_table "ifttb_orders", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "state"
    t.string "order_type"
    t.uuid "asset_id"
    t.decimal "amount"
    t.decimal "amount_usd"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_ifttb_orders_on_user_id"
  end

  create_table "invitations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "invitor_id"
    t.uuid "invitee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invitee_id"], name: "index_invitations_on_invitee_id", unique: true
    t.index ["invitor_id"], name: "index_invitations_on_invitor_id"
  end

  create_table "market_prices", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "market_id"
    t.float "price"
    t.datetime "time", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["market_id"], name: "index_market_prices_on_market_id"
    t.index ["time"], name: "index_market_prices_on_time"
  end

  create_table "markets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "base_asset_id"
    t.uuid "quote_asset_id"
    t.integer "ocean_orders_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "trades_count", default: 0
    t.integer "rank"
    t.datetime "recommended_at", precision: nil
    t.datetime "hidden_at", precision: nil
    t.boolean "booking_order_activity_enable", default: false
    t.index ["base_asset_id"], name: "index_markets_on_base_asset_id"
    t.index ["quote_asset_id"], name: "index_markets_on_quote_asset_id"
  end

  create_table "mixin_assets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "asset_id"
    t.string "name"
    t.string "symbol"
    t.uuid "chain_id"
    t.jsonb "raw", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "price_usd"
    t.index ["asset_id"], name: "index_mixin_assets_on_asset_id", unique: true
  end

  create_table "mixin_conversations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "category"
    t.json "data"
    t.string "name"
    t.uuid "conversation_id", null: false
    t.uuid "code_id"
    t.uuid "creator_id"
    t.uuid "participant_uuids", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_mixin_conversations_on_conversation_id", unique: true
    t.index ["creator_id"], name: "index_mixin_conversations_on_creator_id"
  end

  create_table "mixin_messages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "content", comment: "decrypted data"
    t.uuid "message_id"
    t.string "category"
    t.uuid "user_id"
    t.uuid "conversation_id"
    t.json "raw"
    t.datetime "processed_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["message_id"], name: "index_mixin_messages_on_message_id", unique: true
  end

  create_table "mixin_network_snapshots", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "source_id"
    t.string "source_type"
    t.string "type"
    t.string "snapshot_type"
    t.uuid "user_id"
    t.uuid "trace_id"
    t.uuid "opponent_id"
    t.string "data"
    t.uuid "snapshot_id"
    t.decimal "amount"
    t.uuid "asset_id"
    t.datetime "transferred_at", precision: nil
    t.json "raw"
    t.datetime "processed_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "amount_usd", default: "0.0"
    t.index ["source_id", "source_type"], name: "index_mixin_network_snapshots_on_source_id_and_source_type"
    t.index ["trace_id"], name: "index_mixin_network_snapshots_on_trace_id", unique: true
    t.index ["user_id"], name: "index_mixin_network_snapshots_on_user_id"
  end

  create_table "mixin_network_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "owner_id"
    t.string "owner_type"
    t.string "type", comment: "STI"
    t.uuid "mixin_uuid"
    t.string "name"
    t.uuid "session_id"
    t.string "pin_token"
    t.json "raw"
    t.string "private_key"
    t.string "encrypted_pin"
    t.string "state"
    t.string "ocean_private_key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["mixin_uuid"], name: "index_mixin_network_users_on_mixin_uuid", unique: true
    t.index ["owner_id", "owner_type"], name: "index_mixin_network_users_on_owner_id_and_owner_type"
  end

  create_table "mixin_transfers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "source_id"
    t.string "source_type"
    t.string "transfer_type"
    t.decimal "amount"
    t.uuid "trace_id"
    t.uuid "asset_id"
    t.uuid "user_id"
    t.uuid "opponent_id"
    t.string "memo"
    t.datetime "processed_at", precision: nil
    t.json "snapshot"
    t.string "priority"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "amount_usd", default: "0.0"
    t.json "opponent_multisig", default: "{}"
    t.boolean "stale", default: false
    t.index ["source_id", "source_type"], name: "index_mixin_transfers_on_source_id_and_source_type"
    t.index ["trace_id"], name: "index_mixin_transfers_on_trace_id", unique: true
    t.index ["user_id"], name: "index_mixin_transfers_on_user_id"
  end

  create_table "notifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "recipient_id", null: false
    t.string "recipient_type", null: false
    t.string "type", null: false
    t.jsonb "params"
    t.datetime "read_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["read_at"], name: "index_notifications_on_read_at"
    t.index ["recipient_id", "recipient_type"], name: "index_notifications_on_recipient_id_and_recipient_type"
  end

  create_table "ocean_orders", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "filled_amount"
    t.decimal "filled_funds"
    t.string "order_type"
    t.decimal "price"
    t.decimal "remaining_amount"
    t.decimal "remaining_funds"
    t.string "side"
    t.string "state"
    t.uuid "base_asset_id"
    t.uuid "quote_asset_id"
    t.uuid "user_id"
    t.uuid "broker_id"
    t.uuid "conversation_id"
    t.uuid "trace_id"
    t.float "maker_fee", default: 0.0
    t.float "taker_fee", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "market_id", null: false
    t.uuid "arbitrage_order_id"
    t.index ["arbitrage_order_id"], name: "index_ocean_orders_on_arbitrage_order_id"
    t.index ["market_id"], name: "index_ocean_orders_on_market_id"
  end

  create_table "swap_orders", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "arbitrage_order_id"
    t.uuid "user_id"
    t.uuid "pay_asset_id"
    t.uuid "fill_asset_id"
    t.decimal "pay_amount"
    t.decimal "fill_amount"
    t.decimal "min_amount"
    t.uuid "broker_id"
    t.string "state"
    t.uuid "trace_id"
    t.json "raw"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "applet_activity_id"
    t.string "type"
    t.decimal "pay_amount_usd"
    t.decimal "refund_amount", default: "0.0"
    t.string "route_id"
    t.index ["applet_activity_id"], name: "index_swap_orders_on_applet_activity_id"
    t.index ["arbitrage_order_id"], name: "index_swap_orders_on_arbitrage_order_id"
    t.index ["broker_id"], name: "index_swap_orders_on_broker_id"
    t.index ["fill_asset_id"], name: "index_swap_orders_on_fill_asset_id"
    t.index ["pay_asset_id"], name: "index_swap_orders_on_pay_asset_id"
    t.index ["trace_id"], name: "index_swap_orders_on_trace_id"
    t.index ["user_id"], name: "index_swap_orders_on_user_id"
  end

  create_table "trades", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "market_id", null: false
    t.uuid "trade_id", null: false
    t.uuid "base_asset_id", null: false
    t.uuid "quote_asset_id", null: false
    t.decimal "amount"
    t.decimal "price"
    t.string "side"
    t.json "raw", null: false
    t.datetime "traded_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["base_asset_id"], name: "index_trades_on_base_asset_id"
    t.index ["market_id"], name: "index_trades_on_market_id"
    t.index ["quote_asset_id"], name: "index_trades_on_quote_asset_id"
    t.index ["trade_id"], name: "index_trades_on_trade_id", unique: true
  end

  create_table "user_assets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "asset_id", null: false
    t.uuid "user_id", null: false
    t.decimal "balance", default: "0.0"
    t.decimal "balance_usd", default: "0.0"
    t.json "raw", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["asset_id"], name: "index_user_assets_on_asset_id"
    t.index ["user_id"], name: "index_user_assets_on_user_id"
  end

  create_table "user_authorizations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.string "provider", comment: "third party auth provider"
    t.string "uid", comment: "third party user id"
    t.string "access_token"
    t.json "raw", comment: "third pary user info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_user_authorizations_on_provider_and_uid", unique: true
    t.index ["user_id"], name: "index_user_authorizations_on_user_id"
  end

  create_table "user_ifttb_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_id", null: false
    t.datetime "pro_expired_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_ifttb_profiles_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "avatar_url"
    t.string "mixin_id"
    t.uuid "mixin_uuid"
    t.string "locale"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "assets_synced_at", precision: nil
    t.integer "invitations_count", default: 0
    t.string "invite_code"
    t.datetime "last_active_at", precision: nil
    t.integer "ocean_orders_count", default: 0
    t.index ["invite_code"], name: "index_users_on_invite_code", unique: true
    t.index ["mixin_id"], name: "index_users_on_mixin_id"
    t.index ["mixin_uuid"], name: "index_users_on_mixin_uuid", unique: true
  end

end
