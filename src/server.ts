import { Server } from 'http'
import app from './app'
import config from './config'

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    console.log(`server is running on port ${config.port}`)
    // logger.info(`Server running on port ${config.port}`);
  })

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('server closed')
        // logger.info('Server closed');
      })
    }
    process.exit(1)
  }

  const unexpectedErrorHandler = () => {
    // errorlogger.error(error);
    exitHandler()
  }

  process.on('uncaughtException', unexpectedErrorHandler)
  process.on('unhandledRejection', unexpectedErrorHandler)

  process.on('SIGTERM', () => {
    // logger.info('SIGTERM received');
    if (server) {
      server.close()
    }
  })
}

bootstrap()
