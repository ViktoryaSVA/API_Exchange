import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class ExchangeRatesService {
    private ws: WebSocket;
    private timer: NodeJS.Timer;
    private cryptoCurrency: string;
    private fiatCurrency: string;

    constructor() {
        this.connectWebSocket(this.cryptoCurrency, this.fiatCurrency);
    }

    private connectWebSocket(cryptoCurrency: string, fiatCurrency: string) {
        this.ws = new WebSocket('wss://ws.kraken.com');

        this.ws.on('open', () => {
            console.log('WebSocket connection established');
            clearInterval(this.timer);
        });

        this.ws.on('message', (data: string) => {
            const response = JSON.parse(data);

            if (this.ws.readyState === WebSocket.OPEN && Array.isArray(response) && response[1] && response[1].c) {
                const exchangeRate = response[1].c[0];

                const exchangeRateObj = {
                    crypto_currency: cryptoCurrency,
                    fiat_currency: fiatCurrency,
                    exchange_rate: exchangeRate,
                };

                this.ws.send(JSON.stringify(exchangeRateObj));
            }
        });

        this.ws.on('error', (error) => {
            console.error(`WebSocket error: ${error.message}`);
        });

        this.ws.on('close', () => {
            console.log('WebSocket connection closed');
            this.reconnectWebSocket(cryptoCurrency, fiatCurrency);
        });
    }

    private reconnectWebSocket(cryptoCurrency: string, fiatCurrency: string) {
        console.log('Reconnecting WebSocket in 5 seconds...');
        this.timer = setInterval(() => {
            this.connectWebSocket(cryptoCurrency, fiatCurrency);
        }, 5000);
    }

    async sendExchangeRate(cryptoCurrency: string, fiatCurrency: string) {
        if (this.ws.readyState === WebSocket.OPEN) {
            const exchangeRateObj = {
                crypto_currency: cryptoCurrency,
                fiat_currency: fiatCurrency,
            };
            this.ws.send(JSON.stringify(exchangeRateObj));
        } else {
            console.error('WebSocket is not open');
        }
    }
}
