import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { ORGANIZATION_FIELDS } from "../fragments";
import { makeQuery } from "../utils";
import { Organization } from "../types";

export class OrgQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getOrganization(
    { fragment }: { fragment?: Record<string, DocumentNode> } = {
      fragment: { OrganizationFields: ORGANIZATION_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { OrganizationFields: ORGANIZATION_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_ORGANIZATION = gql`
      ${fValue}
      query organization {
        organization {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ organization: Organization }>(
      this.apollo,
      GET_ORGANIZATION
    );
  }

  public async getOrganizations(
    { fragment }: { fragment?: Record<string, DocumentNode> } = {
      fragment: { OrganizationFields: ORGANIZATION_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { OrganizationFields: ORGANIZATION_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_ORGANIZATIONS = gql`
      ${fValue}
      query organizations {
        organizations {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ organizations: Organization[] }>(
      this.apollo,
      GET_ORGANIZATIONS
    );
  }
}
