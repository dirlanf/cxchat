import {
  BadRequestException,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

@Injectable()
export class ZodWsPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      try {
        return this.schema.parse(value ?? {});
      } catch (e) {
        if (e instanceof ZodError) {
          throw new BadRequestException({
            code: 'WS_PAYLOAD_INVALID',
            issues: e.issues.map((i) => ({ path: i.path, message: i.message })),
          });
        }
        throw e;
      }
    }
    return value;
  }
}
