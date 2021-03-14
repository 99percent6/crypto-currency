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

### Run test
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
