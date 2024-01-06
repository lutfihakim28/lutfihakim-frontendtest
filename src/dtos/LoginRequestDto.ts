import { Expose } from 'class-transformer'

export class LoginRequestDto {
  @Expose({ name: 'username' })
  public username: string

  @Expose({ name: 'password' })
  public password: string
}
