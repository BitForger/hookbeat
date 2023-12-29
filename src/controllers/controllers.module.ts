import { Module } from '@nestjs/common';
import {HooksController} from "./hooks/hooks.controller";
import {ServicesModule} from "../services/services.module";

@Module({
    imports: [ServicesModule],
    controllers: [HooksController]
})
export class ControllersModule {}
