import { DashboardOutlined, LogoutOutlined } from '@ant-design/icons';
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
        <a href='/admin/logout'>
          <LogoutOutlined />
          <span>Logout</span>
        </a>
      </Menu.Item>
    </Menu>
  );
}
