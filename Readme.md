## Install

```sh
$ yarn --frozen-lockfile
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
In config file `config/default.json` ypu could:
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
You have opportunity to send logs in ELK stack, to enable it executes steps below
1. Uncomment services in `docker-compose.yml`
2. Execute command
```sh
$ docker-compose up -d
```
3. In `config/defult.json` enable logstash
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