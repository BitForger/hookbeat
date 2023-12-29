import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ControllersModule} from "./controllers/controllers.module";
import {ServicesModule} from './services/services.module';
import {DatabaseModule} from "./db/database.module";
import {LoggerModule} from "nestjs-pino";
import {nanoid} from "nanoid";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const nodeEnv = configService.get('NODE_ENV')
        const transport = nodeEnv === 'development' && {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
        return {
          pinoHttp: {
            genReqId: req => req.id = nanoid(10),
            transport: transport,
            level: nodeEnv === 'development' ? 'debug' : 'info'
          }
        }
      }
    }),
    ConfigModule.forRoot({isGlobal: true}),
    ControllersModule,
    ServicesModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ControllersModule, ServicesModule]
})
export class AppModule {
}
