import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import { useIfttbBrokerBalanceQuery } from 'graphqlTypes';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function WalletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { loading, data } = useIfttbBrokerBalanceQuery({ skip: !currentUser });

  if (loading) {
    return <LoaderComponent />;
  }

  if (!currentUser) {
    location.replace('/ifttb/login');
    return;
  }

  const assets = data;

  return <></>;
}
