import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IsEmailExistConstraint } from 'src/custom-validation/IsEmailExist';

@Global()
@Module({
  providers: [DatabaseService, IsEmailExistConstraint],
  exports: [DatabaseService]
})
export class DatabaseModule {}
