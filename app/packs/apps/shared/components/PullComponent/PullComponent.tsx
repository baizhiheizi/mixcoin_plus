import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Icon, Pull } from 'zarm';

const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5, // 加载失败
};

const LOAD_STATE = {
  normal: 0, // 普通
  abort: 1, // 中止
  loading: 2, // 加载中
  success: 3, // 加载成功
  failure: 4, // 加载失败
  complete: 5, // 加载完成（无新数据）
};

export default function PullComponent(props: {
  refetch: () => any;
  fetchMore?: () => any;
  hasNextPage: boolean;
  children?: React.ReactChildren | React.ReactChild | any;
  emptyText?: string;
}) {
  const { children, refetch, fetchMore, hasNextPage, emptyText } = props;
  const [refreshing, setRefeshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <Pull
      refresh={{
        handler: () => {
          setRefeshing(REFRESH_STATE.loading);
          refetch().then(() => {
            setRefeshing(REFRESH_STATE.success);
          });
        },
        state: refreshing,
        render: (refreshState, percent) => {
          switch (refreshState) {
            case REFRESH_STATE.pull:
              return (
                <div>
                  <ActivityIndicator loading={false} percent={percent} />
                </div>
              );
            case REFRESH_STATE.drop:
              return (
                <div>
                  <ActivityIndicator loading={false} percent={100} />
                </div>
              );
            case REFRESH_STATE.loading:
              return (
                <div>
                  <ActivityIndicator type='spinner' />
                </div>
              );
            case REFRESH_STATE.success:
              return (
                <div>
                  <Icon type='right-round' theme='success' />
                </div>
              );
            case REFRESH_STATE.failure:
              return (
                <div>
                  <Icon type='wrong-round' theme='danger' />
                </div>
              );
            default:
              return null;
          }
        },
      }}
      load={{
        state: loading,
        distance: 200,
        handler: () => {
          if (hasNextPage) {
            setLoading(LOAD_STATE.loading);
            if (fetchMore) {
              fetchMore().then(() => setLoading(LOAD_STATE.success));
            }
          } else {
            setLoading(LOAD_STATE.complete);
          }
        },
        render: (loadState) => {
          switch (loadState) {
            case LOAD_STATE.loading:
              return (
                <div>
                  <ActivityIndicator type='spinner' />
                </div>
              );
          }
        },
      }}
    >
      {React.Children.toArray(children).length < 1 ? (
        <div className='flex items-center justify-center w-full py-12 text-gray-500'>
          {emptyText || t('no_record')}
        </div>
      ) : (
        children
      )}
    </Pull>
  );
}
