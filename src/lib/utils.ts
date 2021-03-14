import { Response } from 'express'
import logger from './logger'

function sendResponse(
	{ res, result, code = 200, headers = null }
	: { res: Response, result: any, code?: number, headers?: { key: string, value: string }},
): any {
	if (headers) {
		res.header(headers.key, headers.value).status(code).json(result)
		return
	}
	res.status(code).json(result)
}

function sendError(
	{ res, message, code = 500, LOGGER_PREFIX = '' }
	: { res: Response, message: any, code?: number, LOGGER_PREFIX?: string },
): void {
	logger.error(LOGGER_PREFIX, message)
	sendResponse({ res, result: [message, null], code })
}

export {
	sendResponse,
	sendError,
}
