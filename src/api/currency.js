import express from 'express'
import async from 'async'
import { param } from 'express-validator/check'

import error from '../helpers/error'

import checkErrors from '../helpers/check-errors'

import CurrencyDay from '../models/currency-day'

import CURRENCY from '../constants/currencies'

const router = express.Router()

router.get(
	'/:date', [
		param('date', "Date must be with YYYY-MM-DD format or 'latest'")
			.custom((date) => {
				return (!isNaN(Date.parse(date)) || date === 'latest')
			}),

		checkErrors
	], get
)

function get(req, res) {

	let base = CURRENCY.UYU,
		{ date } = req.params

	async.waterfall([

		function getDate(cbGetDate) {
			if (date === 'latest') {
				return CurrencyDay.getLastDate(cbGetDate)
			}

			return cbGetDate(null, date)
		},

		function getRates(date, cbGetRates) {

			if (!date) return cbGetRates(new Error(
				'No data to show'
			))

			return CurrencyDay.getRatesFromDate(date, cbGetRates)
		}

	], function (err, rates) {
		if (err) return error(err, res)

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
	return (theDate && theDate.getTime() / 1000) || null
}

export default router