import {Body, Controller, Headers, HttpCode, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {HookService} from "../../services/hook/hook.service";
import {InjectPinoLogger, PinoLogger} from "nestjs-pino";

@Controller('hooks')
export class HooksController {

  constructor(
    private hookService: HookService,
    @InjectPinoLogger() private readonly logger: PinoLogger
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHook(@Body('description') description: string) {
    this.logger.debug({
      msg: "Description",
      description,
    })
    const result = await this.hookService.create(description)

    if (!result) {
      return new HttpException('There was a problem creating the hook', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return result
  }

  // Authenticate these methods by matching the passed token in the Authorization header by generating
  // a token with the passed id
  // heartbeat controller
  // POST /:id

  @Post('/:id')
  async heartbeat(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string
  ) {
    const token = this.hookService.getToken(id)
    this.logger.debug({
      msg: 'tokens',
      token,
      authHeader,
      matches: authHeader.split('Bearer ')[1] === token
    })
  }

  // Update hook
  // PUT /:id

  // Delete hook
  // DELETE /:id
}
