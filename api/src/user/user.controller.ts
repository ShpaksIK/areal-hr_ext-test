import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HistoryService } from 'src/history/history.service';
import { ResponseDto } from 'src/dto/response.dto';
import { CreateUserDto, UpdateUserDto, User } from 'src/dto/user.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { createUserSchema, updateUserSchema } from 'src/schemas/user.schema';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';
import { Role } from 'src/dto/role.dto';
import { SessionAuthGuard } from 'src/guard/session-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private historyService: HistoryService,
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard)
  async getAll(): Promise<ResponseDto<User[]>> {
    const data = await this.userService.getUsers();

    const response: ResponseDto<User[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Get('/roles')
  @UseGuards(SessionAuthGuard)
  async getRoles(): Promise<ResponseDto<Role[]>> {
    const data = await this.userService.getRoles();

    const response: ResponseDto<Role[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UsePipes(new ValidationPipe(createUserSchema))
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<User>> {
    const createdUser = await this.userService.createUser(createUserDto);

    const response: ResponseDto<User> = {
      success: true,
      message: 'Успешно',
      data: createdUser,
    };

    return response;
  }

  @Put()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(updateUserSchema))
  async update(
    @Body() updatedUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User | null>> {
    const updatedUser = await this.userService.updateUser(updatedUserDto);

    if (!updatedUser.data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    await this.historyService.createHistory({
      user_id: updatedUser.data.id,
      entity_type: 'user',
      entity_id: updatedUser.data.id,
      changed_fields: updatedUser.changed_fields,
    });

    const response: ResponseDto<User> = {
      success: true,
      message: 'Успешно',
      data: updatedUser.data,
    };

    return response;
  }

  @Delete('/:userId')
  @UseGuards(SessionAuthGuard)
  async delete(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<ResponseDto<User>> {
    const deletedUser = await this.userService.deleteUser(userId);

    const response: ResponseDto<User> = {
      success: true,
      message: 'Успешно',
      data: deletedUser,
    };

    return response;
  }
}
