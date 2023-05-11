import { CronJob } from 'node-cron';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import * as WebSocket from 'ws';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
    ) {}

    async findAll(): Promise<Account[]> {
        return this.accountsRepository.find();
    }

    private async getExchangeRates() {
        const pairs = ['XBT/USD', 'XBT/EUR', 'ETH/USD', 'ETH/EUR'];
        const ws = new WebSocket('wss://ws.kraken.com');

        const exchangeRates = {};

        ws.on('open', () => {
            ws.send(
                JSON.stringify({
                    event: 'subscribe',
                    pair: pairs,
                    subscription: {
                        name: 'ticker',
                    },
                }),
            );
        });

        return new Promise((resolve, reject) => {
            let receivedPairs = 0;

            ws.on('message', (data) => {
                const response = JSON.parse(data.toString());

                if (Array.isArray(response) && response.length === 4) {
                    const [pair, values] = response.slice(1);
                    const [bid, ask] = values.c;

                    if (!exchangeRates.hasOwnProperty(pair)) {
                        exchangeRates[pair] = {};
                    }

                    exchangeRates[pair]['USD'] = parseFloat(bid);
                    exchangeRates[pair]['EUR'] = parseFloat(ask);

                    receivedPairs++;

                    if (receivedPairs === pairs.length) {
                        ws.close();
                        resolve(exchangeRates);
                    }
                }
            });

            ws.on('close', () => {
                reject(new Error('WebSocket closed'));
            });

            ws.on('error', (err) => {
                reject(err);
            });
        });
    }

    async updateBalances(): Promise<void> {
        const accounts = await this.accountsRepository.find();

        const exchangeRates = await this.getExchangeRates();

        for (const account of accounts) {
            if (exchangeRates.hasOwnProperty(account.crypto_currency) &&
                exchangeRates[account.crypto_currency].hasOwnProperty(account.fiat_currency)) {
                const exchangeRate = exchangeRates[account.crypto_currency][account.fiat_currency];
                const balanceInFiat = account.balance * exchangeRate;
                account.balance_in_fiat = balanceInFiat;
                await this.accountsRepository.save(account);
            }
        }
    }

    async create(accountData: Partial<Account>): Promise<Account> {
        const account = this.accountsRepository.create(accountData);
        return this.accountsRepository.save(account);
    }
    startCron(): void {
        const job = new CronJob('0 */6 * * *', async () => {
            console.log('Running cron job to update balances...');
            await this.updateBalances();
            console.log('Finished updating balances.');
        });
        job.start();
    }
}
