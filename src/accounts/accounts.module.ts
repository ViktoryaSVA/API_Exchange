import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsCron } from './accounts.cron';
import {ExchangeRatesService} from "../exchange-rates/exchange-rates.service";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [TypeOrmModule.forFeature([Account]), ScheduleModule.forRoot()],
    providers: [AccountsService, AccountsCron, ExchangeRatesService],
    controllers: [AccountsController],
})

export class AccountsModule implements OnModuleInit {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly accountsCron: AccountsCron,
    ) {}

    async onModuleInit() {
        await this.accountsCron.handleCron();
        const accounts = [
            { crypto_currency: 'BTC', fiat_currency: 'USD', balance: 1, balance_in_fiat: '0' },
            { crypto_currency: 'ETH', fiat_currency: 'USD', balance: 1, balance_in_fiat: '0' },
        ];
        const check = await this.accountsService.findAll();

        if (check.length < 1) {
            for (const account of accounts) {
                await this.accountsService.create(account);
            }
        }
    }
}
