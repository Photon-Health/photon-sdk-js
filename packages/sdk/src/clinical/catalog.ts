import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { CATALOG_FIELDS } from "../fragments";
import { makeQuery } from "../utils";
import { Catalog } from "../types";

export class CatalogQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getCatalogs(
    { fragment }: { fragment?: Record<string, DocumentNode> } = {
      fragment: { CatalogFields: CATALOG_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { CatalogFields: CATALOG_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_CATALOGS = gql`
      ${fValue}
      query catalogs {
        catalogs {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ catalogs: Catalog[] }>(this.apollo, GET_CATALOGS);
  }

  public async getCatalog(
    {
      id,
      fragment,
    }: { id: string; fragment?: Record<string, DocumentNode> } = {
      id: "",
      fragment: { CatalogFields: CATALOG_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { CatalogFields: CATALOG_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_CATALOG = gql`
      ${fValue}
      query catalog($id: ID) {
        catalog(id: $id) {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ catalog: Catalog }>(this.apollo, GET_CATALOG, { id });
  }
}
