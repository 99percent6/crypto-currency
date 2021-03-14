## Install

```sh
$ yarn --frozen-lockfile
```
or
```sh
$ npm install
```

## Run

First of all execute command below for runing mysql
```sh
$ docker-compose up -d
```

then you could start server
```sh
$ yarn dev
```

## Commands

### Run tests
```sh
$ yarn mocha
```

### Run linter
```sh
$ yarn lint
```

### Run in debug mode
```sh
$ yarn dev:inspect
```

### Build for production
```sh
$ yarn build
```

### Run in production mode
```sh
$ yarn start
```

## Features

### Settings
In config file `config/default.json` you could:
1. Manage fsyms and tsyms
2. Manage required fields for response
3. Manage interval for background update data in database (in ms)
4. To manage mysql configuration, please, see documentation - https://hub.docker.com/_/mysql

```json
"cryptoCompare": {
  "updateInterval": 60000,
  "fsyms": ["BTC", "XRP", "ETH", "BCH", "EOS", "LTC", "XMR", "DASH"],
  "tsyms": ["USD", "EUR", "GBP", "JPY", "RUR"],
  "requiredFields": [
    "change24hour",
    "changepct24hour",
    "open24hour",
    "volume24hour",
    "volume24hourto",
    "low24hour",
    "high24hour",
    "price",
    "supply",
    "mktcap"
  ],
  "tableName": "currency",
  "url": {
    "multiFull": "https://min-api.cryptocompare.com/data/pricemultifull"
  }
}
```

### Logging
You have opportunity to send logs to the ELK stack, to enable it follow this steps
1. Uncomment services in `docker-compose.yml` (es, logstash, kibana)
2. Execute command
```sh
$ docker-compose up -d
```
3. In `config/default.json` enable logstash
```json
"logger": {
  "name": "Cryptocurrency",
  "server": "localhost",
  "host": "127.0.0.1",
  "port": "5046",
  "appName": "cryptocurrency",
  "logstash": true // here
}
```

## Endpoints

1. GET /api/currency/price?fsyms=BTC,ETH&tsyms=USD,EUR
2. Websocket /api/currency/price
Message
```json
{
  "fsyms": "BTC,ETH",
  "tsyms": "USD,RUR"
}
```
