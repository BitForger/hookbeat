import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Hook} from "../../db/models/hook.model";
import {nanoid} from "nanoid";
import {ConfigService} from '@nestjs/config';
import * as crypto from 'crypto';
import {InjectPinoLogger, PinoLogger} from 'nestjs-pino';

@Injectable()
export class HookService {

    private readonly host: string
    private readonly tokenSalt: string
    constructor(
      @InjectModel(Hook) private hookModel: typeof Hook,
      private readonly configService: ConfigService,
      @InjectPinoLogger() private readonly logger: PinoLogger
    ) {
        this.host = configService.get('DOMAIN_ROOT')
        this.tokenSalt = configService.get('TOKEN_SALT')
    }

    async create(description: string) {
        const id = nanoid()
        const hook = new this.hookModel({
            uniqueId: id,
            description,
        })

        if (!(await hook.save())) {
            // do error condition here
        }

        let token: string = null;
        try {
            token = this.getToken(id)
        } catch (e) {
            this.logger.error({
                msg: 'failed to generate token',
                error: e
            })
        }

        if (!token) {
            return null
        }

        return {
            hook: `http://${this.host}/hooks/${id}`,
            description,
            token,
        }
    }

    getToken(id: string) {
        return crypto.pbkdf2Sync(id, this.tokenSalt, 1024, 128, 'sha512').toString('base64')
    }
}
