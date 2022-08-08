import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { MEDICATION_FIELDS } from "../fragments";
import { makeQuery } from "../utils";
import { Medication } from "../types";

/**
 * GetMedications options
 * @param name Filter medications by drug name
 * @param type Filter medication by type (RX or OTC)
 * @param code Filter medication by NDC/RxCUI
 * @param fragment Allows you to override the default query to request more fields
 */
 export interface GetMedicationsOptions {
  name?: string
  type?: string
  code?: string
  fragment?: Record<string, DocumentNode>
}

/**
  * Contains various methods for Photon Medications
  */
export class MedicationQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

   /**
   * @param apollo - An Apollo client instance
   */
  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  /**
   * Retrieves all medications, optionally filtered by name, type, and code
   * @param options - Query options
   * @returns
   */
  public async getMedications(
    {
      name,
      type,
      code,
      fragment,
    }: GetMedicationsOptions = {
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
