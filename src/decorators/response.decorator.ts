import {
  applyDecorators,
  Inject,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseFilter } from 'src/response/response.filter';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { ResponseService } from 'src/response/response.service';

export function Response(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(ResponseService);
}

export function ResponseStatusCode() {
  return applyDecorators(
    UseInterceptors(ResponseInterceptor),
    UseFilters(ResponseFilter),
  );
}
