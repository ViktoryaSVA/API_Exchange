import { Injectable, Logger } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AccountsCron {
    private readonly logger = new Logger(AccountsCron.name);

    constructor(private readonly accountsService: AccountsService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        await this.accountsService.updateBalances();
        this.logger.debug('Called every dat at 00:00');
    }
}
