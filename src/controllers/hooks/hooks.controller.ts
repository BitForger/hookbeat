import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HookService } from '../../services/hook/hook.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HookAuthGuard } from '../../core/guards/hook-auth/hook-auth.guard';
import { UpdateHookDto } from './UpdateHookDto';

@Controller('hooks')
export class HooksController {
  constructor(
    private hookService: HookService,
    @InjectPinoLogger() private readonly logger: PinoLogger,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHook(@Body('description') description: string) {
    this.logger.debug({
      msg: 'Description',
      description,
    });
    const result = await this.hookService.create(description);

    if (!result) {
      return new HttpException(
        'There was a problem creating the hook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  // Authenticate these methods by matching the passed token in the Authorization header by generating
  // a token with the passed id
  // heartbeat controller
  // POST /:id
  @Post('/:id')
  @UseGuards(HookAuthGuard)
  async heartbeat(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = this.hookService.getToken(id);
    await this.hookService.addHeartbeat(id);
    this.logger.debug({
      msg: 'tokens',
      token,
      authHeader,
      matches: authHeader.split('Bearer ')[1] === token,
    });
  }

  // Update hook
  // PUT /:id
  @Put('/:id')
  @UseGuards(HookAuthGuard)
  async updateHook(@Param('id') id: string, @Body() body: UpdateHookDto) {
    if (
      body?.description &&
      (await this.hookService.updateHook(id, { description: body.description }))
    ) {
      return HttpStatus.NO_CONTENT;
    }

    return new BadRequestException();
  }

  // Delete hook
  // DELETE /:id
}
