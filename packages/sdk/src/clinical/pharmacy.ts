import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { PHARMACY_FIELDS } from "../fragments";
import { makeQuery } from "../utils";
import { LatLongSearch, Pharmacy } from "../types";

export class PharmacyQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getPharmacies(
    {
      name,
      location,
      fragment,
    }: {
      name?: string;
      location?: LatLongSearch;
      fragment?: Record<string, DocumentNode>;
    } = {
      fragment: { PharmacyFields: PHARMACY_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { PharmacyFields: PHARMACY_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_PHARMACIES = gql`
      ${fValue}
      query pharmacies($name: String, $location: LatLongSearch) {
        pharmacies(name: $name, location: $location) {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ pharmacies: Pharmacy[] }>(this.apollo, GET_PHARMACIES, {
      name,
      location,
    });
  }
}
