import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsCron } from './accounts.cron';

@Module({
    imports: [TypeOrmModule.forFeature([Account])],
    providers: [AccountsService, AccountsCron],
    controllers: [AccountsController],
})

export class AccountsModule implements OnModuleInit {
    constructor(private readonly accountsService: AccountsService) {}

    async onModuleInit() {
        const accounts = [
            { crypto_currency: 'BTC', fiat_currency: 'USD', balance: 1 },
            { crypto_currency: 'ETH', fiat_currency: 'USD', balance: 1 },
        ];

        for (const account of accounts) {
            await this.accountsService.create(account);
        }
    }
}
