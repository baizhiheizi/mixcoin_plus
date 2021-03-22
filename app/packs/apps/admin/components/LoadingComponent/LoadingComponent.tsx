import { Spin } from 'antd';
import React from 'react';

export default function LoadingComponent() {
  return (
    <div className='w-full p-8 text-center'>
      <Spin />
    </div>
  );
}
