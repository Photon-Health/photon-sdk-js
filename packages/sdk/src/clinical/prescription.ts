import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { PRESCRIPTION_FIELDS } from "../fragments";
import { Maybe, Prescription, PrescriptionState } from "../types";
import { makeMutation, makeQuery } from "../utils";

export class PrescriptionQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getPrescriptions(
    {
      patientId,
      patientName,
      prescriberId,
      state,
      after,
      first,
      fragment,
    }: {
      patientId?: Maybe<string>;
      patientName?: Maybe<string>;
      prescriberId?: Maybe<string>;
      state?: Maybe<PrescriptionState>;
      after?: Maybe<string>;
      first?: Maybe<number>;
      fragment?: Record<string, DocumentNode>;
    } = {
      first: 25,
      fragment: { PrescriptionFields: PRESCRIPTION_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { PrescriptionFields: PRESCRIPTION_FIELDS };
    }
    if (!first) {
      first = 25;
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_PRESCRIPTIONS = gql`
          ${fValue}
          query prescriptions(
            $patientId: ID
            $patientName: String
            $prescriberId: ID
            $state: PrescriptionState
            $after: ID
            $first: Int
        ) {
            prescriptions(
                filter: {
                    patientId: $patientId
                    patientName: $patientName
                    prescriberId: $prescriberId
                    state: $state
                }
                after: $after
                first: $first
            ) {
                ...${fName}
            }
          }
        `;
    return makeQuery<{ prescriptions: Prescription[] }>(
      this.apollo,
      GET_PRESCRIPTIONS,
      { patientId, patientName, prescriberId, state, after, first }
    );
  }

  public async getPrescription(
    {
      id,
      fragment,
    }: { id: string; fragment?: Record<string, DocumentNode> } = {
      id: "",
      fragment: { PrescriptionFields: PRESCRIPTION_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { PrescriptionFields: PRESCRIPTION_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_PRESCRIPTION = gql`
          ${fValue}
          query prescription($id: ID!) {
            prescription(id: $id) {
              ...${fName}
            }
          }
        `;
    return makeQuery<{ prescription: Prescription }>(
      this.apollo,
      GET_PRESCRIPTION,
      {
        id,
      }
    );
  }

  public createPrescription({
    fragment,
  }: {
    fragment?: Record<string, DocumentNode>;
  }) {
    if (!fragment) {
      fragment = { PrescriptionFields: PRESCRIPTION_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const CREATE_PRESCRIPTION = gql`
      ${fValue}
      mutation createPrescription(
        $externalId: ID
        $patientId: ID!
        $medicationId: ID!
        $dispenseAsWritten: Boolean!
        $dispenseQuantity: Int!
        $dispenseUnit: DispenseUnit!
        $refillsAllowed: Int!
        $daysSupply: Int!
        $instructions: String!
        $notes: String
        $effectiveDate: AWSDate
        $diagnoses: [ID]
      ) {
        createPrescription(
          externalId: $externalId
          patientId: $patientId
          medicationId: $medicationId
          dispenseAsWritten: $dispenseAsWritten
          dispenseQuantity: $dispenseQuantity
          dispenseUnit: $dispenseUnit
          refillsAllowed: $refillsAllowed
          daysSupply: $daysSupply
          instructions: $instructions
          notes: $notes
          effectiveDate: $effectiveDate
          diagnoses: $diagnoses
        ) {
          ...${fName}
        }
      }`;
    return makeMutation<{ createPrescription: Prescription } | undefined | null>(
      this.apollo,
      CREATE_PRESCRIPTION
    );
  }
}
