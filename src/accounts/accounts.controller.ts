import { Controller, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @Get()
    async findAll(): Promise<Account[]> {
        return this.accountsService.findAll();
    }
}
