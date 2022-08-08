import { Auth0Client, LogoutOptions, RedirectLoginOptions, RedirectLoginResult } from "@auth0/auth0-spa-js";

export class AuthManager {
  private authentication: Auth0Client;

  private organization?: string;

  private audience?: string;

  constructor({
    authentication,
    organization,
    audience = "https://api.photon.health",
    uri = "https://api.photon.health/graphql",
  }: {
    authentication: Auth0Client;
    organization?: string;
    audience?: string;
    uri?: string;
  }) {
    this.authentication = authentication;
    this.organization = organization;
    this.audience = audience;
  }

  public async login(
    {
      organizationId,
      invitation,
      appState,
    }: {
      organizationId?: string;
      invitation?: string;
      appState?: object;
    } = {
      organizationId: this.organization,
    }
  ): Promise<void> {
    let opts: RedirectLoginOptions<any> = { redirectMethod: "assign" };

    if (organizationId) {
      opts = Object.assign(opts, { organization: organizationId });
    }
    if (invitation) {
      opts = Object.assign(opts, { invitation });
    }

    if (appState) {
      opts = Object.assign(opts, { appState });
    }

    return this.authentication.loginWithRedirect(opts);
  }

  public async logout({ returnTo }: { returnTo?: string }): Promise<void> {
    let opts: LogoutOptions = {};

    if (returnTo) {
      opts = Object.assign(opts, { returnTo });
    }

    return this.authentication.logout(opts);
  }

  public async getAccessToken(
    { audience }: { audience?: string } = {
      audience: this.audience,
    }
  ): Promise<string> {
    return this.authentication.getTokenSilently({ audience });
  }

  public async checkSession(): Promise<void> {
    return this.authentication.checkSession();
  }

  public async handleRedirect(url?: string): Promise<RedirectLoginResult<any>> {
    try {
      return this.authentication.handleRedirectCallback(url);
    } catch (err) {
      throw err;
    }
  }

  public async getUser() {
    return this.authentication.getUser();
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      await this.authentication.checkSession();
      return await this.authentication.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
}
