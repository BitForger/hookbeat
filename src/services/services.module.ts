import { Module } from '@nestjs/common';
import { HookService } from './hook/hook.service';
import {DatabaseModule} from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HookService],
  exports: [HookService]
})
export class ServicesModule {}
