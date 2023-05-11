import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class ExchangeRatesService {
    private ws: WebSocket;
    private timer: NodeJS.Timer;
    private cryptoCurrency: string;
    private fiatCurrency: string;
    private exchangeRates: Record<string, Record<string, number>> = {};

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

    public async sendExchangeRate(cryptoCurrency: string, fiatCurrency: string) {
        if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(
                    JSON.stringify({
                        event: 'subscribe',
                        pair: [`${cryptoCurrency.toUpperCase()}/${fiatCurrency.toUpperCase()}`],
                        subscription: { name: 'ticker' },
                    }),
                );

                return new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        this.ws.close();
                        reject('Timeout');
                    }, 5000);

                    this.ws.on('message', (data: string) => {
                        const response = JSON.parse(data);

                        if (Array.isArray(response) && response[1] && response[1].c) {
                            const exchangeRate = response[1].c[0];
                            console.log(cryptoCurrency)
                            const exchangeRateObj = {
                                crypto_currency: cryptoCurrency,
                                fiat_currency: fiatCurrency,
                                exchange_rate: exchangeRate,
                            };
                            this.ws.send(JSON.stringify(exchangeRateObj));
                            clearTimeout(timeout);
                            this.ws.close();
                            resolve(exchangeRateObj);
                        }
                    });
                });
        } else {
            console.error('WebSocket is not open');
        }
    }
    public async getExchangeRates(): Promise<Record<string, Record<string, number>>> {
        const pairs = ['XBT/USD', 'XBT/EUR', 'ETH/USD', 'ETH/EUR'];
        const ws = new WebSocket('wss://ws.kraken.com');
        const exchangeRates: Record<string, Record<string, number>> = {};

        pairs.forEach(pair => {
            const [cryptoCurrency, fiatCurrency] = pair.split('/');
            exchangeRates[cryptoCurrency] = { [fiatCurrency]: 0 };
        });

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                ws.close();
                reject('Timeout');
            }, 5000);

            ws.on('open', () => {
                pairs.forEach(pair => {
                    ws.send(JSON.stringify({
                        event: 'subscribe',
                        pair: [pair],
                        subscription: { name: 'ticker' },
                    }));
                });
            });

            ws.on('message', (data: string) => {
                const response = JSON.parse(data);

                if (Array.isArray(response) && response[1] && response[1].c) {
                    const [pair, ticker] = response;
                    const [cryptoCurrency, fiatCurrency] = response.pop().split('/');
                    exchangeRates[cryptoCurrency][fiatCurrency] = parseFloat(ticker.c[0]);
                }

                if (Object.keys(exchangeRates).every(cryptoCurrency => Object.keys(exchangeRates[cryptoCurrency]).every(fiatCurrency => exchangeRates[cryptoCurrency][fiatCurrency] !== 0))) {
                    clearTimeout(timeout);
                    ws.close();
                    resolve(exchangeRates);
                }
            });
        });
    }
}
