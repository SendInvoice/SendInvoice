export type CreateUserPayload = {
  name: string;
  surname: string;
  email: string;
};

export type LoginPayload = {
  email: string;
}

export type Token = {
  id: string;
  token: string;
}
export class AuthClient {
  private baseUrl: URL;

  constructor(baseUrl: URL) {
    this.baseUrl = baseUrl;
  }

  async whoAmI(token: string) {
    const url = new URL(this.baseUrl);
    url.pathname = `/api/v1/auth/whoami`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 403) {
      throw new Error('Not authenticated');
    }

    throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
  }

  async createUser(payload: CreateUserPayload): Promise<Token> {
    const url = new URL(this.baseUrl);
    url.pathname = `/api/v1/auth/sing-up`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const json = await response.json();
      return json as Token;
    }

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid user data');
    }

    throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
  }

  async login(payload: LoginPayload): Promise<Token> {
    const url = new URL(this.baseUrl);
    url.pathname = `/api/v1/auth/log-in`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return (await response.json()) as Token;
    }

    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }
}