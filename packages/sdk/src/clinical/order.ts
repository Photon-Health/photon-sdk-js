import {
  ApolloClient,
  DocumentNode,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { ORDER_FIELDS } from "../fragments";
import { makeMutation, makeQuery } from "../utils";
import { Maybe, Order } from "../types";

export class OrderQueryManager {
  private apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.apollo = apollo;
  }

  public async getOrders(
    {
      patientId,
      patientName,
      after,
      first,
      fragment,
    }: {
      patientId?: Maybe<string>;
      patientName?: Maybe<string>;
      after?: Maybe<string>;
      first?: number;
      fragment?: Record<string, DocumentNode>;
    } = {
      first: 25,
      fragment: { OrderFields: ORDER_FIELDS },
    }
  ) {
    if (!first) {
      first = 25;
    }
    if (!fragment) {
      fragment = { OrderFields: ORDER_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_ORDERS = gql`
        ${fValue}
        query orders(
          $patientId: ID
          $patientName: String
          $after: ID
          $first: Int
      ) {
          orders(
              filter: {
                  patientId: $patientId
                  patientName: $patientName
              }
              after: $after
              first: $first
          ) {
              ...${fName}
          }
        }
      `;
    return makeQuery<{ orders: Order[] }>(this.apollo, GET_ORDERS, {
      patientId,
      patientName,
      after,
      first,
    });
  }

  public async getOrder(
    {
      id,
      fragment,
    }: { id: string; fragment?: Record<string, DocumentNode> } = {
      id: "",
      fragment: { OrderFields: ORDER_FIELDS },
    }
  ) {
    if (!fragment) {
      fragment = { OrderFields: ORDER_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const GET_ORDER = gql`
        ${fValue}
        query order($id: ID!) {
          order(id: $id) {
            ...${fName}
          }
        }
      `;
    return makeQuery<{ order: Order }>(this.apollo, GET_ORDER, { id: id });
  }

  public createOrder({
    fragment,
  }: {
    fragment?: Record<string, DocumentNode>;
  }) {
    if (!fragment) {
      fragment = { OrderFields: ORDER_FIELDS };
    }
    let [fName, fValue] = Object.entries(fragment)[0];
    const CREATE_ORDER = gql`
      ${fValue}
      mutation createOrder(
        $externalId: ID
        $patientId: ID!
        $fills: [FillInput!]!
        $address: AddressInput!
        $pharmacyId: ID!
      ) {
        createOrder(
          externalId: $externalId
          patientId: $patientId
          fills: $fills
          address: $address
          pharmacyId: $pharmacyId
        ) {
          ...${fName}
        }
      }
    `;
    return makeMutation<{ createOrder: Order } | undefined | null>(
      this.apollo,
      CREATE_ORDER
    );
  }
}
