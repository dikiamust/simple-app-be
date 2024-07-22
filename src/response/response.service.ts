import { BadRequestException, Injectable } from '@nestjs/common';
import { IErrors, IResponse, IResponsePaging } from './response.interface';

@Injectable()
export class ResponseService {
  error(error: any) {
    if (error.driverError && error.code === '23502') {
      throw new BadRequestException('Missing required field');
    }

    if (error.driverError) {
      throw new BadRequestException(error.driverError.detail);
    }

    if (error.message && error.message.includes('identity_number')) {
      throw new BadRequestException(`The identity number already exists.`);
    }

    throw error;
  }

  success(
    message: string,
    data?: Record<string, any> | Record<string, any>[],
  ): IResponse {
    if (data) {
      return {
        message: message,
        data: data,
      };
    }

    return {
      message: message,
    };
  }

  paging(
    message: string,
    totalPage: number,
    currentPage: number,
    data: Record<string, any>[],
  ): IResponsePaging {
    return {
      message: message,
      total_page: totalPage,
      current_page: currentPage,
      data,
    };
  }
}
