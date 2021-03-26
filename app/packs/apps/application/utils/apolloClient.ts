import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Loading, Toast } from 'zarm';

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

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        oceanMarketConnection: customizedConnectionMergeFunction(['type', 'query']),
        oceanOrderConnection: customizedConnectionMergeFunction([
          'oceanMarketId',
          'filter',
        ]),
      },
    },
  },
});

export const apolloClient = (uri: string, conversationId?: string) => {
  const csrfToken: any =
    document.querySelector("meta[name='csrf-token']") || {};

  const httpLink = new HttpLink({
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken.content,
      'X-Conversation-Id': conversationId || '',
    },
    uri: uri || '/graphql',
  });
  const onErrorLink = onError(() => {
    Loading.hide();
    Toast.show(':(');
  });

  return new ApolloClient({
    cache,
    link: onErrorLink.concat(httpLink),
  });
};
