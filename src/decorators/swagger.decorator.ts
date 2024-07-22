import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums';

export const ApiController = ({
  tag,
  version,
}: {
  tag: string;
  version?: ApiVersion;
}) => {
  let apiTag = version + ' - ' + tag;
  if (!version) {
    apiTag = tag;
  }

  return applyDecorators(
    ApiTags(apiTag),
    ApiHeader({
      name: 'Api-Version',
      description: 'Target API version',
      enum: ApiVersion,
    }),
  );
};

export const ApiQueryPagination = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      description: 'Display data at which page (default: 1)',
      type: 'number',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Limit data per page (default: 10)',
      type: 'number',
      required: false,
    }),
  );
