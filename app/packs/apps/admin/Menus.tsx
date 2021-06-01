import {
  BarsOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  RetweetOutlined,
  ShareAltOutlined,
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
      <Menu.Item>
        <Link to='/'>
          <DashboardOutlined />
          <span>Dashboard</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/users'>
          <UserOutlined />
          <span>Users</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/invitations'>
          <ShareAltOutlined />
          <span>Invitations</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/markets'>
          <BarsOutlined />
          <span>Markets</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/ocean_orders'>
          <SyncOutlined />
          <span>Ocean Orders</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/swap_orders'>
          <SyncOutlined />
          <span>Swap Orders</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/mixin_network_snapshots'>
          <MoneyCollectOutlined />
          <span>Snapshots</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/mixin_transfers'>
          <PayCircleOutlined />
          <span>Transfers</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/mixin_conversations'>
          <UsergroupAddOutlined />
          <span>Conversations</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/mixin_messages'>
          <MessageOutlined />
          <span>Messages</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/mixin_network_users'>
          <UserOutlined />
          <span>MixinNetworkUser</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/balance'>
          <DollarOutlined />
          <span>Balance</span>
        </Link>
      </Menu.Item>
      <Menu.SubMenu title='Arbitrage' icon={<RetweetOutlined />}>
        <Menu.Item>
          <Link to='/arbitragers'>
            <span>Arbitragers</span>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/arbitrage_orders'>
            <span>Orders</span>
          </Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item>
        <a href='/admin/logout'>
          <LogoutOutlined />
          <span>Logout</span>
        </a>
      </Menu.Item>
    </Menu>
  );
}
