import { Token } from '@/utils/Token';

export class CustomRequest {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL
  }

  public async GET(path: string, query?: Record<string, string | number | Array<number | string>>): Promise<unknown> {
    try {
      const token = new Token()
      const queryString = query ? this.generateQueryString(query) : '';
      const url = this.baseUrl + path + (query ? '?' : '') + queryString;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'content-type': 'application/json'
        },
      });

      return this.resolveResponse(response);
    } catch (error) {
      return this.errorHandling(error)
    }
  }

  public async POST(path: string, payload?: Record<string, unknown> | FormData): Promise<unknown> {
    try {
      const token = new Token()
      const url = this.baseUrl + path;
      let response: Response;
      if (payload instanceof FormData) {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.token}`,
          },
          body: payload
        });
      } else {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.token}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }

      return this.resolveResponse(response);
    } catch (error) {
      return this.errorHandling(error)
    }
  }

  private async resolveResponse(response: Response) {
    if (response.status < 300) {
      const data = await response.json();
      return Promise.resolve(data)
    }
    if (response.status === 401) {
      const error: CustomErrorType = {
        statusCode: 401,
        message: 'Unauthorized'
      }
      return Promise.reject(error)
    }

    if (response.status === 422) {
      const error: CustomErrorType = {
        statusCode: 422,
        message: 'Unporcessable content'
      }
      return Promise.reject(error)
    }
  }

  private errorHandling(error: unknown): Promise<unknown> {
    if (error instanceof TypeError) {
      return Promise.reject('Network Error')
    }
    if (error instanceof SyntaxError) {
      return Promise.reject('There are some syntax error')
    }
    return Promise.reject(error);
  }

  private generateQueryString(query: Record<string, string | number | Array<number | string>>): string {
    const qs = new URLSearchParams();
    for (const key in query) {
      const value = query[key];
      if (value instanceof Array) {
        value.forEach((v) => {
          qs.append(`${key}[]`, v.toString())
        })
      } else {
        qs.append(key, value.toString())
      }
    }
    return qs.toString();
  }
}
