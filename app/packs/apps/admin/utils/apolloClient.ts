import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { message } from 'antd';

const customizedConnectionMergeFunction = (
  keyArgs: false | string[] = false,
): {
  keyArgs: any;
  merge: (existing: any, incoming: any, options?: any) => any;
} => {
  return {
    keyArgs,
    merge(existing: any, incoming: any, { args }) {
      if (args?.after === existing?.pageInfo?.endCursor) {
        const nodes = existing ? [...existing.nodes] : [];
        return {
          ...incoming,
          nodes: [...nodes, ...incoming.nodes],
        };
      } else {
        return incoming;
      }
    },
  };
};

export const apolloClient = (uri: string) => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          adminInvitationConnection: customizedConnectionMergeFunction([
            'invitorId',
          ]),
          adminUserConnection: customizedConnectionMergeFunction(['query']),
          adminMixinConversationConnection: customizedConnectionMergeFunction(),
          adminMarketConnection: customizedConnectionMergeFunction([
            'query',
            'quoteAssetId',
          ]),
          adminMixinMessageConnection: customizedConnectionMergeFunction(),
          adminMixinNetworkSnapshotConnection: customizedConnectionMergeFunction(
            ['oceanOrderId', 'snapshotType', 'type'],
          ),
          adminMixinNetworkUserConnection: customizedConnectionMergeFunction([
            'query',
            'state',
            'type',
          ]),
          adminMixinTransferConnection: customizedConnectionMergeFunction([
            'oceanOrderId',
            'userId',
            'opponentId',
            'transferType',
          ]),
          adminOceanOrderConnection: customizedConnectionMergeFunction([
            'conversationId',
            'marketId',
            'query',
            'state',
            'userId',
          ]),
          adminTradeConnection: customizedConnectionMergeFunction(['marketId']),
        },
      },
    },
  });
  const csrfToken: any =
    document.querySelector("meta[name='csrf-token']") || {};

  const httpLink = new HttpLink({
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken.content,
    },
    uri: uri || '/graphql',
  });
  const onErrorLink = onError(() => {
    message.error('Something wrong happens');
  });

  return new ApolloClient({
    cache,
    link: onErrorLink.concat(httpLink),
  });
};
