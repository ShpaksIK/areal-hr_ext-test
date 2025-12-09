import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ResponseDto } from 'src/dto/response.dto';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error, value: validatedValue } = this.schema.validate(value);

    if (error) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Ошибка валидации',
        errors: error.details,
      };

      throw new BadRequestException(errorResponse);
    }

    return validatedValue;
  }
}
