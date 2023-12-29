import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Hook} from "./models/hook.model";
import {ConfigModule, ConfigService} from '@nestjs/config';


@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        let storage = configService.get('SQLITE_FILE_LOCATION')
        if (!storage) {
          console.log('Using default sqlite file storage location')
          storage = './monitors.sqlite'
        }
        return {
          dialect: 'sqlite',
          host: 'localhost',
          database: 'monitors',
          storage,
          autoLoadModels: true,
          synchronize: true
        }
      }
    }),
    SequelizeModule.forFeature([Hook])
  ],
  providers: [],
  exports: [SequelizeModule]
})
export class DatabaseModule {
}