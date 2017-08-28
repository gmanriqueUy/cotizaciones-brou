import db from "../config/db-connection";

const CurrencyDay = {
	insertDays
};

/**
 * 
 * @param {array} days Array of days, each with array of currencies
 * @param {function} cb The callback
 */
function insertDays(days, cb) {
	let inserts = [];

	days.forEach(day => {
		day.currencies.forEach(currency => {
			inserts.push([
				currency.iso,
				day.date,
				currency.buy,
				currency.sell
			]);
		});
	});

	db.connection().query(
		`INSERT INTO currencyDay(
			iso,
			date,
			buy,
			sell
		) VALUES ?`, [
			inserts
		], (err) => {
			if(err) return cb(err);

			return cb(null);
		}
	);
}

export default CurrencyDay;