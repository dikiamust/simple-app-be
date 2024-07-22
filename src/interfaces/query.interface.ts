import { SortingType } from '../enums';

export interface IQuery {
  readonly page?: number;
  readonly limit?: number;
  readonly sortingBy?: string;
  readonly sortingType?: SortingType;
  readonly keyword?: string;
}
