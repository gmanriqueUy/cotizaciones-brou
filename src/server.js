import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorhandler from 'errorhandler'
import morgan from 'morgan'
import methodOverride from 'method-override'
import logger from 'loglevel'

import api from './api'
import db from './config/db-connection'

const isProduction = process.env.NODE_ENV === 'production'

export default start

async function start() {
  // Create global app object
  const app = express()

  db.connect(() => {
    logger.info('Connected to DB')
  })

  app.use(cors())

  // Normal express config defaults
  if (logger.getLevel() < 3) {
    app.use(morgan('dev'))
  }
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cookieParser())

  app.use(methodOverride())
  app.use(express.static(`${__dirname}/public`))
  
  if (!isProduction) {
    app.use(errorhandler())
  }
  
  app.use('/api', api)

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  /// error handlers

  // development error handler
  // will print stacktrace
  if (!isProduction) {
    app.use((err, req, res) => {
      logger.error(err.stack)

      res.status(err.status || 500)

      res.json({
        errors: {
          message: err.message,
          error: err,
        },
      })
    })
  }

  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res) => {
    logger.error(err.stack)

    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    })
  })

  // finally, let's start our server...
  return new Promise(resolve => {
    const server = app.listen(process.env.PORT || 3000, () => {
      logger.info(`Listening on port ${server.address().port}`)
      server.on('close', () => {

        db.disconnect(() => {
          logger.info('DB connections ended correctly')
        })

      })

      return resolve(server)
    })
  })
}
