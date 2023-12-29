import {Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req} from '@nestjs/common';
import {nanoid} from 'nanoid'
import {HookService} from "../../services/hook/hook.service";
import {InjectPinoLogger, PinoLogger} from "nestjs-pino";

@Controller('hooks')
export class HooksController {

    constructor(
        private hookService: HookService,
        @InjectPinoLogger() private readonly logger: PinoLogger
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createHook(@Body('description') description: string ) {
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
}
