import { Down as DownIcon } from '@icon-park/react';
import { useDebounce } from 'ahooks';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import { PandoLake } from 'pando-sdk-js';
import { IAsset } from 'pando-sdk-js/dist/lake/types';
import React, { useState } from 'react';

let lakeAssets: IAsset[];
const pando = new PandoLake();
pando.assets().then((res) => {
  lakeAssets = res.data.assets.filter(
    (asset) => !asset.symbol.match(/^s(\S+-\S+)/),
  );
});

export default function LakeAssetsComponent(props: {
  onClick: (asset: IAsset) => any;
}) {
  const [query, setQuery] = useState('');
  const deboundedQuery = useDebounce(query, { wait: 500 });
  const assets = deboundedQuery
    ? lakeAssets.filter(
        (asset) =>
          asset.symbol.match(new RegExp(deboundedQuery, 'i')) ||
          asset.name.match(new RegExp(deboundedQuery, 'i')),
      )
    : lakeAssets;

  if (lakeAssets.length < 1) {
    return <LoaderComponent />;
  }
  return (
    <div className='relative overflow-y-scroll bg-white rounded-t-lg pt-28 min-h-screen-3/4 max-h-screen-3/4'>
      <div className='fixed top-0 z-10 w-full p-2 bg-white rounded-t-lg'>
        <div className='flex justify-center'>
          <DownIcon size='2rem' />
        </div>
        <div className='px-4 py-2'>
          <input
            className='block w-full p-4 bg-gray-100 rounded'
            placeholder='Search'
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </div>
      </div>
      {(assets || []).map((asset) => (
        <div
          key={asset.id}
          className='flex items-center justify-between p-4'
          onClick={() => props.onClick(asset)}
        >
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <img className='w-8 h-8 rounded-full' src={asset.logo} />
              <img
                className='absolute bottom-0 right-0 w-4 h-4 rounded-full'
                src={asset.chain.logo}
              />
            </div>
            <span>{asset.symbol}</span>
          </div>
          <div className='text-sm opacity-50'>
            $ {(asset.price / 1)?.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
