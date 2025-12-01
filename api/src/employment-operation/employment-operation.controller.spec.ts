import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentOperationController } from './employment-operation.controller';

describe('EmploymentOperationController', () => {
  let controller: EmploymentOperationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmploymentOperationController],
    }).compile();

    controller = module.get<EmploymentOperationController>(
      EmploymentOperationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
