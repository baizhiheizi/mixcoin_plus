import {
  BarsOutlined,
  DashboardOutlined,
  DollarOutlined,
  FundOutlined,
  LogoutOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  RetweetOutlined,
  ShareAltOutlined,
  SwapOutlined,
  SyncOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Menus() {
  return (
    <Menu theme='dark' mode='inline'>
      <div className='h-8 m-2 text-center leading-8'>Admin</div>
      <Menu.Item key='dashboard'>
        <Link to='/'>
          <DashboardOutlined />
          <span>Dashboard</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='users'>
        <Link to='/users'>
          <UserOutlined />
          <span>Users</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='invitations'>
        <Link to='/invitations'>
          <ShareAltOutlined />
          <span>Invitations</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='markets'>
        <Link to='/markets'>
          <BarsOutlined />
          <span>Markets</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='ocean_orders'>
        <Link to='/ocean_orders'>
          <SyncOutlined />
          <span>Ocean Orders</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='swap_orders'>
        <Link to='/swap_orders'>
          <SwapOutlined />
          <span>Swap Orders</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='arbitrage_orders'>
        <Link to='/arbitrage_orders'>
          <RetweetOutlined />
          <span>Arbitrage Orders</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='mixin_network_snapshots'>
        <Link to='/mixin_network_snapshots'>
          <MoneyCollectOutlined />
          <span>Snapshots</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='mixin_transfers'>
        <Link to='/mixin_transfers'>
          <PayCircleOutlined />
          <span>Transfers</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='mixin_conversations'>
        <Link to='/mixin_conversations'>
          <UsergroupAddOutlined />
          <span>Conversations</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='mixin_messages'>
        <Link to='/mixin_messages'>
          <MessageOutlined />
          <span>Messages</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='mixin_network_users'>
        <Link to='/mixin_network_users'>
          <UserOutlined />
          <span>MixinNetworkUser</span>
        </Link>
      </Menu.Item>
      <Menu.SubMenu icon={<FundOutlined />} key='booking_order_activity' title='Activity'>
        <Menu.Item key='booking_order_activities'>
          <Link to='/booking_order_activities'>
            <span>BookingOrderActivities</span>
          </Link>
        </Menu.Item>
        <Menu.Item key='booking_order_snapshots'>
          <Link to='/booking_order_snapshots'>
            <span>BookingOrderSnapshots</span>
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key='balance'>
        <Link to='/balance'>
          <DollarOutlined />
          <span>Balance</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='logout'>
        <a href='/admin/logout'>
          <LogoutOutlined />
          <span>Logout</span>
        </a>
      </Menu.Item>
    </Menu>
  );
}
