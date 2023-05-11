import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import {ExchangeRatesService} from "../exchange-rates/exchange-rates.service";

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
        private readonly exchangeRatesService: ExchangeRatesService
    ) {}

    async findAll(): Promise<Account[]> {
        return this.accountsRepository.find();
    }

    async updateBalances(): Promise<void> {
        const accounts = await this.accountsRepository.find();

        const exchangeRates = await this.exchangeRatesService.getExchangeRates();

        for (const account of accounts) {
            const { crypto_currency, fiat_currency, balance } = account;
            let currency;
            if (crypto_currency === 'BTC') {
                currency = 'XBT'
            } else {
                currency = crypto_currency;
            }
            if (Object.keys(exchangeRates).includes(currency) &&
                Object.keys(exchangeRates[currency]).includes(fiat_currency)) {

                const exchangeRate = exchangeRates[currency][fiat_currency];
                const balanceInFiat = balance * exchangeRate;
                account.balance_in_fiat = balanceInFiat.toString();
                await this.accountsRepository.save(account);
            }

        }
    }

    async create(accountData: Partial<Account>): Promise<Account> {
        const account = this.accountsRepository.create(accountData);
        return this.accountsRepository.save(account);
    }
}
