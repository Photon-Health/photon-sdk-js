import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ClientQueryManager } from "./client";
import { OrgQueryManager } from "./organization";
import { WebhookQueryManager } from "./webhook";

export class ManagementQueryManager {
  public client: ClientQueryManager;
  public organization: OrgQueryManager;
  public webhook: WebhookQueryManager;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.client = new ClientQueryManager(apollo);
    this.organization = new OrgQueryManager(apollo);
    this.webhook = new WebhookQueryManager(apollo);
  }
}
