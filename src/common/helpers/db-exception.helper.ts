import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function onSaveDBError(error: any, logger?: Logger): never {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error?.driverError?.code === '23505') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new BadRequestException(error?.driverError?.detail);
  }

  if (logger) {
    logger.error(error);
  }

  throw new InternalServerErrorException('Unexpected error, check server logs');
}
