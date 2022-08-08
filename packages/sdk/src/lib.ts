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

export * from "./types";
export * from "./fragments";

export class PhotonSDK {
  private organization?: string

  private audience?: string

  private uri?: string

  private auth0Client: Auth0Client

  public authentication: AuthManager;

  public clinical: ClinicalQueryManager

  public management: ManagementQueryManager

  constructor({
    domain,
    clientId,
    redirectURI,
    organization,
    audience = "https://api.photon.health",
    uri = "https://api.photon.health/graphql",
  }: {
    domain: string;
    clientId: string;
    redirectURI?: string;
    organization?: string;
    audience?: string;
    uri?: string;
  }) {
    this.auth0Client = new Auth0Client({
      domain,
      client_id: clientId,
      redirect_uri: redirectURI,
      cacheLocation: "memory",
    });
    this.authentication = new AuthManager({ authentication: this.auth0Client, organization, audience, uri });
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
          console.log(error);
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

  public setDevelopment() {
    this.audience = "https://api.boson.health"
    this.uri = "https://api.boson.health/graphql"
    this.authentication = new AuthManager({ authentication: this.auth0Client, organization: this.organization, audience: this.audience, uri: this.uri });
    let apollo = this.constructApolloClient();
    this.clinical = new ClinicalQueryManager(apollo);
    this.management = new ManagementQueryManager(apollo);
    return this;
  }
}