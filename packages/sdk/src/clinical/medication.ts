import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { MEDICATION_FIELDS } from "../fragments";
import { makeQuery } from "../utils";
import { Medication } from "../types";

export class MedicationQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getMedications(
    {
      name,
      type,
      code,
      fragment,
    }: {
      name?: string;
      type?: string;
      code?: string;
      fragment?: Record<string, DocumentNode>;
    } = {
      fragment: { MedicationFields: MEDICATION_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { MedicationFields: MEDICATION_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_MEDICATIONS = gql`
      ${fValue}
      query medications($name: String, $type: MedicationType, $code: String) {
        medications(filter: { name: $name, type: $type, code: $code }) {
          ...${fName}
    }
  }
    `;
    return makeQuery<{ medications: Medication[] }>(
      this.apollo,
      GET_MEDICATIONS,
      {
        name,
        type,
        code,
      }
    );
  }
}
