export class Token {
  public token: string | undefined;

  constructor() {
    this.token = localStorage.getItem('token') ?? undefined;
  }

  get isLoggedIn(): boolean {
    if (!!this.token) {
      return true
    }

    return false;
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token)
  }
}
