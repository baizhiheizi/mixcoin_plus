import { Down as DownIcon } from '@icon-park/react';
import { useDebounce } from 'ahooks';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import { MixinAsset, useMixinAssetsQuery } from 'graphqlTypes';
import React, { useState } from 'react';

export default function MixinAssetsComponent(props: {
  source: '4swap' | 'MixSwap' | 'PandoLeaf' | 'PandoRings';
  onClick: (asset: Partial<MixinAsset> | any) => any;
}) {
  const { source, onClick } = props;
  const { data, loading } = useMixinAssetsQuery({ variables: { source } });
  const [query, setQuery] = useState('');
  const deboundedQuery = useDebounce(query, { wait: 500 });

  if (loading) {
    return <LoaderComponent />;
  }

  const { mixinAssets: assets } = data;

  const assetOptions = deboundedQuery
    ? assets.filter(
        (asset) =>
          asset.symbol.match(new RegExp(deboundedQuery, 'i')) ||
          asset.name.match(new RegExp(deboundedQuery, 'i')),
      )
    : assets;
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
      <div
        className='flex items-center justify-center p-4 font-bold text-gray-500'
        onClick={() => onClick(null)}
      >
        Unselect
      </div>
      {(assetOptions || []).map((asset) => (
        <div
          key={asset.assetId}
          className='flex items-center justify-between p-4'
          onClick={() => onClick(asset)}
        >
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <img className='w-8 h-8 rounded-full' src={asset.iconUrl} />
              <img
                className='absolute bottom-0 right-0 w-4 h-4 rounded-full'
                src={asset.chainAsset.iconUrl}
              />
            </div>
            <span>{asset.symbol}</span>
          </div>
          <div className='text-sm opacity-50'>
            $ {(asset.priceUsd / 1)?.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
