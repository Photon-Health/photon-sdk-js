import {
  Auth0Client
} from "@auth0/auth0-spa-js";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context/index.js";
import { AuthManager } from "./auth";
import { ClinicalQueryManager } from "./clinical";
import { ManagementQueryManager } from "./management";

export * as types from "./types";
export * as fragments from "./fragments";

/**
 * Configuration options for Photon SDK
 * @param domain The Auth0 domain
 * @param clientId A client_id of Auth0 client credentials
 * @param redirectURI A url to redirect to after login
 * @param organization An id of an organization to login as
 * @param audience The top-level domain of the Photon API
 * @param uri The GraphQL endpoint of the Photon API
 */
export interface PhotonClientOptions {
  domain: string
  clientId: string
  redirectURI?: string
  organization?: string;
  audience?: string;
    uri?: string;
}

export class PhotonClient {
  private organization?: string

  private audience?: string

  private uri?: string

  private auth0Client: Auth0Client

  /**
   * Authentication functionality of the SDK
   */
  public authentication: AuthManager;

  /**
   * Clinical API functionality of the SDK
   */
  public clinical: ClinicalQueryManager

  /**
   * Management API functionality of the SDK
   */
  public management: ManagementQueryManager

  /**
   * Constructs a new PhotonSDK instance
   * @param config - Photon SDK configuration options
   * @remarks - Note, that organization is optional for scenarios in which a provider supports more than themselves.
   */
  constructor({
    domain,
    clientId,
    redirectURI,
    organization,
    audience = "https://api.photon.health",
    uri = "https://api.photon.health/graphql",
  }: PhotonClientOptions) {
    this.auth0Client = new Auth0Client({
      domain,
      client_id: clientId,
      redirect_uri: redirectURI,
      cacheLocation: "memory",
    });
    this.organization = organization;
    this.authentication = new AuthManager({ authentication: this.auth0Client, organization, audience });
    this.uri = uri;
    let apollo = this.constructApolloClient();
    this.clinical = new ClinicalQueryManager(apollo);
    this.management = new ManagementQueryManager(apollo);
  }

  private constructApolloClient() {
    let apollo = new ApolloClient({
      link: setContext(async (_, { headers, ...rest }) => {
        let token;

        try {
          token = await this.authentication.getAccessToken();
        } catch (error) {
          if ((error as Error).message.includes("Consent required")) {
            token = await this.authentication.getAccessTokenWithConsent();
          } else {
            throw error;
          }
        }

        if (!token) {
          return { headers, ...rest };
        }

        return {
          ...rest,
          headers: {
            ...headers,
            authorization: token,
          },
        };
      }).concat(
        new HttpLink({
          uri: this.uri,
        })
      ),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: "all",
        },
      },
      cache: new InMemoryCache(),
    });
    return apollo
  }

  /**
   * Sets the SDK to operate in development mode, using the Neutron (sandbox) environment
   * @returns PhotonSDK
   */
  public setDevelopment() {
    this.audience = "https://api.neutron.health"
    this.uri = "https://api.neutron.health/graphql"
    this.authentication = new AuthManager({ authentication: this.auth0Client, organization: this.organization, audience: this.audience });
    let apollo = this.constructApolloClient();
    this.clinical = new ClinicalQueryManager(apollo);
    this.management = new ManagementQueryManager(apollo);
    return this;
  }
}