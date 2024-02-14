import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { HookService } from '../../../services/hook/hook.service';

@Injectable()
export class HookAuthGuard implements CanActivate {
  constructor(private hookService: HookService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    const id = request.params['id'];
    const testToken = this.hookService.getToken(id);
    return testToken === authHeader.split('Bearer ')[1];
  }
}
