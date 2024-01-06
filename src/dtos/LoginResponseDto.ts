import { Expose } from 'class-transformer'

export class LoginResponseDto {
  @Expose({ name: 'access_token' })
  public accessToken: string

  @Expose({ name: 'token_type' })
  public tokenType: string
}
