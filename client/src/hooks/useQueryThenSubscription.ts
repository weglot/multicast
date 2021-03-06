import { useQuery, useSubscription } from 'react-apollo-hooks';

import { DocumentNode } from 'graphql';
import { ApolloError } from 'apollo-client';
import { Alert } from '../types';

export function useQueryThenSubscription<T>(
  query: DocumentNode,
  subscription: DocumentNode,
  querySelector: string,
  defaultValue = [],
): {
  data: T[];
  queryData: { [selector: string]: T[] | undefined };
  subscriptionData: { [selector: string]: T[] | undefined };
  loading: boolean;
  queryLoading: boolean;
  subscriptionLoading: boolean;
  error?: ApolloError;
  queryError?: ApolloError;
  subscriptionError?: ApolloError;
} {
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(query);
  const {
    data: subscriptionData = {},
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(subscription) as any;
  const data =
    subscriptionData[querySelector] || queryData[querySelector] || defaultValue;
  const loading = queryLoading || subscriptionLoading;
  const error = subscriptionError || queryError;
  return {
    data,
    queryData,
    subscriptionData,
    loading,
    queryLoading,
    subscriptionLoading,
    error,
    queryError,
    subscriptionError,
  };
}
