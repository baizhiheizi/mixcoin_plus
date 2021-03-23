import React from 'react';
import { Icon, Toast } from 'zarm';

export const ToastError = (msg: string) =>
  Toast.show(
    <div className='text-center'>
      <Icon theme='danger' type='wrong-round' size='lg' />
      <div className='mt-2'>{msg}</div>
    </div>,
  );
