export interface IErrors {
  readonly message: string;
  readonly property: string;
}

export interface IResponse {
  readonly message: string;
  readonly errors?: IErrors[];
  readonly data?: Record<string, any> | Record<string, any>[];
}

export interface IResponsePaging extends Omit<IResponse, 'errors' | 'data'> {
  readonly total_page: number;
  readonly current_page: number;
  readonly data: Record<string, any> | Record<string, any>[];
}
