import { ApolloClient, ApolloQueryResult, DocumentNode, FetchPolicy, FetchResult, NormalizedCacheObject } from "@apollo/client";

export async function makeQuery<T = any>(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>,
    query: DocumentNode,
    variables: object = {},
    fetchPolicy?: FetchPolicy,
  ): Promise<
    ApolloQueryResult<T> & {
      refetch: (variables: object) => Promise<ApolloQueryResult<T>>;
      fetchMore: ({
        after,
        first,
      }: {
        after?: string;
        first?: string;
      }) => Promise<ApolloQueryResult<T>>;
    }
  > {
    let result = await apollo.query({
      query,
      variables,
      fetchPolicy
    });

    return {
      ...result,
      refetch: (vars: object) =>
        apollo.query({ query, variables: Object.assign(variables, vars) }),
      fetchMore: ({ after, first }) =>
        apollo.query({
          query,
          variables: Object.assign(variables, { after, first }),
        }),
    };
  }

  export function makeMutation<T = any>(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>,
    mutation: DocumentNode
  ): ({
    variables,
    refetchQueries,
    awaitRefetchQueries,
  }: {
    variables: object;
    refetchQueries?: { query: DocumentNode }[];
    awaitRefetchQueries: boolean;
  }) => Promise<FetchResult<T>> {
    return ({
      variables,
      refetchQueries,
      awaitRefetchQueries = false,
    }: {
      variables: object;
      refetchQueries?: { query: DocumentNode }[];
      awaitRefetchQueries: boolean;
    }) => {
      return apollo.mutate<T>({
        mutation,
        refetchQueries,
        awaitRefetchQueries,
        variables,
      });
    }
  }