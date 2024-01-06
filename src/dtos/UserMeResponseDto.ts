import { Expose, Transform } from 'class-transformer'

export class UserMeResponseDto {
  @Expose({ name: 'email' })
  public email: string

  @Expose({ name: 'name' })
  public name: string

  @Expose({ name: 'phone' })
  public phone: string

  @Expose({ name: 'token' })
  public token: string

  @Expose({ name: 'age' })
  @Transform(({ value }) => Number(value))
  public age: number

  @Expose({ name: 'photos' })
  public photos: string[]
}
