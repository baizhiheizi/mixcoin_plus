import React from 'react';
import { ActivityIndicator } from 'zarm';

export default function LoaderComponent() {
  return (
    <div className='flex items-center justify-center min-h-screen-1/4'>
      <ActivityIndicator size='lg' />
    </div>
  );
}
