import onFinished from 'on-finished'
import logger from '../lib/logger'

export default function errorHandler(req, res, next) {
	const logRequest = (err, response) => {
		if (response.statusCode >= 400 && response.statusCode < 600) {
			logger.error('API LOGS: ', JSON.stringify({
				code: response.statusCode,
				method: req.method,
				originalUrl: req.originalUrl,
				body: req.body,
				params: req.params,
				query: req.query,
				error: (err && err.message) || err || response.locals.error || response.statusMessage,
			}))
		}
	}
	onFinished(res, logRequest)
	next()
}
