import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { PATIENT_FIELDS } from "../fragments";
import { makeMutation, makeQuery } from "../utils";
import { Patient } from "../types";

export class PatientQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getPatient(
    {
      id,
      fragment,
    }: {
      id: string;
      fragment?: Record<string, DocumentNode>;
    } = {
      id: "",
      fragment: { PatientFields: PATIENT_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { PatientFields: PATIENT_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_PATIENT = gql`
      ${fValue}
      query patient($id: ID!) {
        patient(id: $id) {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ patient: Patient }>(this.apollo, GET_PATIENT, { id });
  }

  public async getPatients(
    {
      after,
      first,
      name,
      fragment,
    }: {
      after?: string;
      first?: number;
      name?: string;
      fragment?: Record<string, DocumentNode>;
    } = { first: 25, fragment: { PatientFields: PATIENT_FIELDS } }
  ) {
    if (!fragment) {
      fragment = { PatientFields: PATIENT_FIELDS };
    }
    if (!first) {
      first = 25;
    }
    let [fName, fValue] = Object.entries(fragment!)[0];
    const GET_PATIENTS = gql`
      ${fValue}
      query patients($after: ID, $name: String, $first: Int) {
        patients(after: $after, first: $first, filter: { name: $name }) {
          ...${fName}
        }
      }
    `;
    return makeQuery<{ patients: Patient[] }>(this.apollo, GET_PATIENTS, {
      after,
      name,
      first,
    });
  }

  public createPatient({
    fragment,
  }: {
    fragment?: Record<string, DocumentNode>;
  }) {
    if (!fragment) {
      fragment = { PatientFields: PATIENT_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const CREATE_PATIENT = gql`
      ${fValue}
      mutation createPatient(
        $externalId: ID
        $name: NameInput!
        $dateOfBirth: AWSDate!
        $sex: SexType!
        $gender: String
        $email: AWSEmail
        $phone: AWSPhone!
        $allergies: [ConceptInput]
        $medicationHistory: [ConceptInput]
      ) {
        createPatient(
          externalId: $externalId
          name: $name
          dateOfBirth: $dateOfBirth
          sex: $sex
          gender: $gender
          email: $email
          phone: $phone
          allergies: $allergies
          medicationHistory: $medicationHistory
        ) {
          ...${fName}
        }
      }`;
    return makeMutation<{ createPatient: Patient } | undefined | null>(
      this.apollo,
      CREATE_PATIENT
    );
  }
}
