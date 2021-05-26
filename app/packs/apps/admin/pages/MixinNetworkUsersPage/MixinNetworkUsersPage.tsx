import { useDebounce } from 'ahooks';
import { Input, PageHeader, Select } from 'antd';
import MixinNetworkUsersComponent from 'apps/admin/components/MixinNetworkUsersComponent/MixinNetworkUsersComponent';
import React, { useState } from 'react';

export default function MixinNetworkUsersPage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('all');
  const [type, setType] = useState('Broker');
  const debouncedQuery = useDebounce(query, { wait: 1000 });

  return (
    <>
      <PageHeader title='Mixin Network Users Manage' />
      <div className='flex items-center mb-4'>
        <Select
          className='w-32 mr-2'
          value={type}
          onChange={(value) => setType(value)}
        >
          <Select.Option value=''>All</Select.Option>
          <Select.Option value='Broker'>Broker</Select.Option>
          <Select.Option value='Arbitrager'>Arbitrager</Select.Option>
        </Select>
        <Select
          className='w-32 mr-2'
          value={state}
          onChange={(value) => setState(value)}
        >
          <Select.Option value='all'>All</Select.Option>
          <Select.Option value='unready'>Unready</Select.Option>
          <Select.Option value='created'>Created</Select.Option>
          <Select.Option value='balanced'>Balanced</Select.Option>
          <Select.Option value='ready'>Ready</Select.Option>
        </Select>
        <Input
          className='w-36'
          placeholder='ID/mixin UUID'
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      </div>
      <MixinNetworkUsersComponent query={query} state={state} type={type} />
    </>
  );
}
