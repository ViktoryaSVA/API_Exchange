import { Controller, Get, Query } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';

@Controller('api/exchange-rates')
export class ExchangeRatesController {
    constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

    @Get()
    async getExchangeRate(
        @Query('crypto_currency') cryptoCurrency: string,
        @Query('fiat_currency') fiatCurrency: string,
    ) {
        await this.exchangeRatesService.sendExchangeRate(
            cryptoCurrency,
            fiatCurrency,
        );
    }
}
