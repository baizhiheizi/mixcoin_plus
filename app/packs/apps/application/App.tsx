import React from 'react';

export default function App(props: { page: string }) {
  return (
    <>
      <span className='font-bold text-red-500'>Hello world</span> {props.page}{' '}
    </>
  );
}
