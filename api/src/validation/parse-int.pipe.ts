import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ResponseDto } from 'src/dto/response.dto';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const validatedValue = parseInt(value, 10);

    if (isNaN(validatedValue)) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Ошибка валидации: идентификатор должен быть числом',
      };

      throw new BadRequestException(errorResponse);
    }
    return validatedValue;
  }
}
