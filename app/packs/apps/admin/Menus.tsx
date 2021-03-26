import {
  BarsOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MessageOutlined,
  PayCircleOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Menus() {
  return (
    <Menu theme='dark'>
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
        <Link to='/ocean_markets'>
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
        <Link to='/mixin_network_snapshots'>
          <PayCircleOutlined />
          <span>Snapshots</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/mixin_messages'>
          <MessageOutlined />
          <span>Messages</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/balance'>
          <DollarOutlined />
          <span>Balance</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a href='/admin/logout'>
          <LogoutOutlined />
          <span>Logout</span>
        </a>
      </Menu.Item>
    </Menu>
  );
}