import React from 'react';
import { ActivityIndicator } from 'zarm';

export default function LoaderComponent() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <ActivityIndicator size='lg' />
    </div>
  );
}
