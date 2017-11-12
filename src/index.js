import logger from 'loglevel'
import server from './server'

logger.setLevel(getLogLevel())

server()

function getLogLevel() {
	const notProd = process.env.NODE_ENV !== 'production'
	const notTest = process.env.NODE_ENV !== 'test'
	return process.env.LOG_LEVEL || (notProd && notTest ? 'info' : 'warn')
}
