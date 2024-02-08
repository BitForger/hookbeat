import { Module } from '@nestjs/common';
import {HookAuthGuard} from './guards/hook-auth/hook-auth.guard';

@Module({
  providers: [HookAuthGuard],
  exports: [HookAuthGuard]
})
export class CoreModule {}
