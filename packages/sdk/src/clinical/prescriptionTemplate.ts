import {
    ApolloClient,
    DocumentNode,
    gql,
    NormalizedCacheObject,
  } from "@apollo/client";
import { PRESCRIPTION_TEMPLATE_FIELDS } from "../fragments";
import { PrescriptionTemplate } from "../types";
  import { makeMutation, makeQuery } from "../utils";

  export interface CreatePrescriptionTemplateOptions {
    fragment?: Record<string, DocumentNode>;
  }

  export interface DeletePrescriptionTemplateOptions {
    fragment?: Record<string, DocumentNode>;
  }
  
  /**
   * Contains various methods for Photon Prescription Templates
   */
  export class PrescriptionTemplateQueryManager {
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
     * Creates a new prescription template
     * @param options - Query options
     * @returns
     */
    public createPrescriptionTemplate({ fragment }: CreatePrescriptionTemplateOptions) {
      if (!fragment) {
        fragment = { PrescriptionTemplateFields: PRESCRIPTION_TEMPLATE_FIELDS };
      }
      let [fName, fValue] = Object.entries(fragment)[0];
      const CREATE_PRESCRIPTION_TEMPLATE = gql`
        ${fValue}
        mutation createPrescriptionTemplate(
          $catalogId: ID!,
          $treatmentId: ID!,
          $dispenseAsWritten: Boolean,
          $dispenseQuantity: Float,
          $dispenseUnit: String,
          $refillsAllowed: Int,
          $daysSupply: Int,
          $instructions: String,
          $notes: String
        ) {
          createPrescriptionTemplate(
            catalogId: $catalogId
            treatmentId: $treatmentId
            dispenseAsWritten: $dispenseAsWritten
            dispenseQuantity: $dispenseQuantity
            dispenseUnit: $dispenseUnit
            refillsAllowed: $refillsAllowed
            daysSupply: $daysSupply
            instructions: $instructions
            notes: $notes
        ) {
            ...${fName}
        }
      }
      `;
      return makeMutation<{ createPrescriptionTemplate: PrescriptionTemplate } | undefined | null>(
        this.apollo,
        CREATE_PRESCRIPTION_TEMPLATE
      );
    }

    /**
     * Deletes an existing prescription template
     * @param options - Query options
     * @returns
     */
     public deletePrescriptionTemplate({ fragment }: DeletePrescriptionTemplateOptions) {
      if (!fragment) {
        fragment = { PrescriptionTemplateFields: PRESCRIPTION_TEMPLATE_FIELDS };
      }
      let [fName, fValue] = Object.entries(fragment)[0];
      const DELETE_PRESCRIPTION_TEMPLATE = gql`
        ${fValue}
        mutation deletePrescriptionTemplate(
          $catalogId: ID!,
          $templateId: ID!
        ) {
          deletePrescriptionTemplate(
            catalogId: $catalogId
            templateId: $templateId
        ) {
            ...${fName}
        }
      }
      `;
      return makeMutation<{ deletePrescriptionTemplate: PrescriptionTemplate } | undefined | null>(
        this.apollo,
        DELETE_PRESCRIPTION_TEMPLATE
      );
    }
  }