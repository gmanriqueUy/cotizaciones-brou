import express from 'express'
import async from 'async'
import { param } from 'express-validator/check'

import internalError from '../helpers/internal-error'

import CurrencyDay from '../models/currency-day'

import CURRENCY from '../constants/currencies'

const router = express.Router()

router.get(
	'/:date', [
		param('iso', 'Invalid ISO')
			.isAlpha()
	], getLatest
)

function getLatest(req, res) {

	let base = CURRENCY.UYU,
	{date} = req.params

	async.waterfall([

		function getDate(cbGetDate) {
			if(date === 'latest') {
				return CurrencyDay.getLastDate(cbGetDate)
			}

			return cbGetDate(null, date)
		},

		function getRatesOfLastDate(lastDate, cbGetRates) {
			
			CurrencyDay.getRatesFromDate(lastDate, cbGetRates)
		}
	], function(err, rates) {
		if(err) return internalError(err, res)

		let objRates = {}

		rates.forEach((currency) => {
			date = currency.date

			objRates[currency.iso] = {
				sell: currency.sell,
				buy: currency.buy
			}
		})

		return res.json({
			base,
			timestamp: getTimestamp(date),
			rates: objRates
		})
	})
}

function getTimestamp(theDate) {
	return theDate.getTime() / 1000
}

export default router