import bunyan from 'bunyan'
import bunyanLogstash from 'bunyan-logstash'
import config from 'config'

type Stream = {
  type?: string,
  stream: NodeJS.WriteStream,
  reemitErrorEvents?: boolean
}

const streams: Stream[] = [
  {
    stream: process.stdout,
  },
]

if (config.get('logger.logstash')) {
  streams.push({
    type: 'raw',
    stream: bunyanLogstash.createStream({
      server: config.get('logger.server'),
      host: config.get('logger.host'),
      port: config.get('logger.port'),
      appName: config.get('logger.appName'),
    }),
    reemitErrorEvents: true,
  })
}

const logger = bunyan.createLogger({
  name: config.get('logger.name'),
  streams,
})

logger.on('error', (err) => {
  console.error(err)
})

export default logger
