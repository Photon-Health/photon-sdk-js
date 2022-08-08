import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { WEBHOOK_CONFIG_FIELDS } from "../fragments";
import { makeMutation, makeQuery } from "../utils";
import { WebhookConfig } from "../types";

export class WebhookQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getWebhooks(
    { fragment }: { fragment?: Record<string, DocumentNode> } = {
      fragment: { WebhookFields: WEBHOOK_CONFIG_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { WebhookFields: WEBHOOK_CONFIG_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_WEBHOOKS = gql`
      ${fValue}
      query webhooks {
        webhooks {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ webhooks: WebhookConfig[] }>(this.apollo, GET_WEBHOOKS);
  }

  public createWebhook({
    fragment,
  }: {
    fragment?: Record<string, DocumentNode>;
  }) {
    if (!fragment) {
      fragment = { WebhookFields: WEBHOOK_CONFIG_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const CREATE_WEBHOOK = gql`
      ${fValue}
      mutation createWebhook(
        $name: String
        $filters: [String]
        $sharedSecret: String
        $url: String!
      ) {
        createWebhookConfig(name: $name, filters: $filters, sharedSecret: $sharedSecret, url: $url) {
          ...${fName}
        }
      }`;
    return makeMutation<{ createWebhookConfig: WebhookConfig } | undefined | null>(
      this.apollo,
      CREATE_WEBHOOK
    );
  }

  public deleteWebhook() {
    const DELETE_WEBHOOK = gql`
      mutation deleteWebhookConfig($id: String!) {
        deleteWebhookConfig(id: $id)
      }`;
    return makeMutation<{ deleteWebhookConfig: boolean } | undefined | null>(
      this.apollo,
      DELETE_WEBHOOK
    );
  }
}
