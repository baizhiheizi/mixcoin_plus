import { useAdminLoginMutation } from 'graphqlTypes';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, message } from 'antd';
import React from 'react';

const { Content } = Layout;

export default function LoginPage() {
  const [login] = useAdminLoginMutation({
    update(_, { data: { adminLogin } }) {
      if (adminLogin) {
        location.replace('/admin');
      } else {
        message.error('Failed');
      }
    },
  });

  return (
    <Layout className='layout'>
      <Content className='flex min-h-screen'>
        <Form
          onFinish={(values: any) => {
            login({ variables: { input: values } });
          }}
          className='m-auto w-60'
        >
          <Form.Item
            name='name'
            rules={[{ required: true, message: 'Username' }]}
          >
            <Input
              prefix={<UserOutlined className='text-gray-500' />}
              placeholder='Username'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Password' }]}
          >
            <Input
              prefix={<ClockCircleOutlined className='text-gray-500' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={false}
              type='primary'
              htmlType='submit'
              className='login-form-button'
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
