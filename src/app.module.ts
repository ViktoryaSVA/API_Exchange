import { Module } from '@nestjs/common';
import { config } from 'dotenv';

config();

import { ExchangeRatesController } from './exchange-rates/exchange-rates.controller';
import { ExchangeRatesService } from './exchange-rates/exchange-rates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './accounts/entities/account.entity';
import { AccountsService } from './accounts/accounts.service';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsCron } from './accounts/accounts.cron';
import {AccountsModule} from "./accounts/accounts.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Account]),
        AccountsModule,
    ],
    controllers: [AccountsController, ExchangeRatesController],
    providers: [AccountsService, AccountsCron, ExchangeRatesService],
    exports: [AccountsService, ExchangeRatesService],
})
export class AppModule {}
