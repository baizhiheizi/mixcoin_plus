import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import OrdersComponent from 'apps/application/components/OrdersComponent/OrdersComponent';
import React from 'react';

export default function OrdersPage() {
  return (
    <div className='min-h-screen bg-white dark:bg-dark'>
      <NavbarComponent back />
      <OrdersComponent />
    </div>
  );
}
