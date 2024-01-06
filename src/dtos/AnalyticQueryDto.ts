import { Expose } from 'class-transformer'

export class AnalyticQueryDto {
  @Expose({ name: 'listing_date' })
  public listingDate?: string
}
