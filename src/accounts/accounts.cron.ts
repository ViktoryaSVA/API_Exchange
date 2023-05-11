import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AccountsService } from './accounts.service';

@Injectable()
export class AccountsCron {
    constructor(private readonly accountsService: AccountsService) {}

    @Cron('0 */1 * * * *') // запускати кожні 10 хвилин
    async handleCron() {
        console.log('Running updateBalances cron job');
        await this.accountsService.updateBalances();
        console.log('Finished updateBalances cron job');
    }
}
