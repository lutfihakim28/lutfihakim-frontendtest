import { Expose, Transform } from 'class-transformer'

export class AnalyticDto {
  @Expose({ name: 'scope' })
  public scope: string

  @Expose({ name: 'date' })
  public date: string

  @Expose({ name: 'count' })
  @Transform(({ value }) => Number(value))
  public count: number
}
