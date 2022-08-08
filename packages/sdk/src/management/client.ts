import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { CLIENT_FIELDS } from "../fragments";
import { makeMutation, makeQuery } from "../utils";
import { Client } from "../types";

export class ClientQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getClients(
    { fragment }: { fragment?: Record<string, DocumentNode> } = {
      fragment: { ClientFields: CLIENT_FIELDS },
    }
  ) {
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_CLIENTS = gql`
          ${fValue}
          query clients {
            clients {
              ...${fName}
            }
          }
        `;
    return makeQuery<{ clients: Client[] }>(this.apollo, GET_CLIENTS);
  }

  public rotateSecret({
    fragment,
  }: {
    fragment?: Record<string, DocumentNode>;
  }) {
    if (!fragment) {
      fragment = { ClientFields: CLIENT_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const ROTATE_SECRET = gql`
      ${fValue}
      mutation rotateSecret(
        $id: ID!
      ) {
        rotateSecret(id: $id) {
          ...${fName}
        }
      }
    `;
    return makeMutation<{ rotateSecret: Client } | undefined | null>(
      this.apollo,
      ROTATE_SECRET
    );
  }
}
