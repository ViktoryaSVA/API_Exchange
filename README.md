## API_Exchange

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run bild
$ npm start

```

## Configure .env file
You should create the Postgres db and configure the .env file with that date.
```bash
POSTGRES_USER='some user'

POSTGRES_PASSWORD='some password'

POSTGRES_DB='some db name'

POSTGRES_PORT='some port'
```

## List of available currencies
```bash
    Bitcoin - BTC
    Bitcoin Cash - BCH
    Ethereum - ETH
```

# Examples of requests
#### Get the exchange rate of one or more cryptocurrencies to one or more fiat currencies (USD, EUR, CAD, JPY, GBP, CHF, AUD).
### GET
```bash
http://localhost:3000/api/exchange-rates?crypto_currency=${crypto_currency}&fiat_currency=${fiat_currency}
```
### Example
```bash
http://localhost:3000/api/exchange-rates?crypto_currency=BCH&fiat_currency=JPY
```
### Example of result
```bash
{
    "crypto_currency": "BCH",
    "fiat_currency": "JPY",
    "exchange_rate": "14965.000000"
}
```

#### Get list of accounts
### GET
```bash
http://localhost:3000/accounts
```

### Example of result
```bash
[
    {
        "id": 227,
        "balance": 1,
        "balance_in_fiat": "26948.6",
        "crypto_currency": "BTC",
        "fiat_currency": "USD"
    },
    {
        "id": 228,
        "balance": 1,
        "balance_in_fiat": "24701.9",
        "crypto_currency": "BTC",
        "fiat_currency": "EUR"
    },
    {
        "id": 229,
        "balance": 1,
        "balance_in_fiat": "1788.01",
        "crypto_currency": "ETH",
        "fiat_currency": "USD"
    },
    {
        "id": 230,
        "balance": 1,
        "balance_in_fiat": "1638.53",
        "crypto_currency": "ETH",
        "fiat_currency": "EUR"
    },
    {
        "id": 231,
        "balance": 1,
        "balance_in_fiat": "111.77",
        "crypto_currency": "BCH",
        "fiat_currency": "USD"
    },
    {
        "id": 232,
        "balance": 1,
        "balance_in_fiat": "102.41",
        "crypto_currency": "BCH",
        "fiat_currency": "EUR"
    }
]
```