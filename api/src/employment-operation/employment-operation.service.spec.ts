import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentOperationService } from './employment-operation.service';

describe('EmploymentOperationService', () => {
  let service: EmploymentOperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentOperationService],
    }).compile();

    service = module.get<EmploymentOperationService>(
      EmploymentOperationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
