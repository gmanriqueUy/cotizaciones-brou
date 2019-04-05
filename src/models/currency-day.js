import db from "../config/db-connection";

const CurrencyDay = {
  getLastDate,
  getRatesFromDate,
  insertDays
};

/**
 * Return rates from given date
 * @date
 */
function getRatesFromDate(date, cb) {
  db.connection().query(
    `SELECT *
    FROM currencyDay
    WHERE date = (
      SELECT MAX(date)
      FROM currencyDay
      WHERE date <= ?
    )`,
    date,
    (err, rates) => {
      if(err) return cb(err);

      return cb(null, rates);
    }
  );
}

/**
 * Return last date existing on DB
 */
function getLastDate(cb) {
  db.connection().query(
    `SELECT MAX(date) lastDate
    FROM currencyDay
    `, (err, results) => {
      if(err) return cb(err);

      if(results.length !== 1) {
        return cb(new Error('Forgot how to do max!'));
      }

      return cb(null, results[0].lastDate);
    }
  );
}

/**
 * Insert the array of days
 * @param {array} days Array of days, each with array of currencies
 * @param {function} cb The callback
 */
function insertDays(days, cb) {
  const inserts = [];
  const daysKeys = Object.keys(days);

  if(!daysKeys || daysKeys.length === 0) {
    return cb(null, 0);
  }

  daysKeys.forEach(date => {
    const day = days[date];
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
    ], (err, result) => {
      if(err) return cb(err);

      return cb(null, result.affectedRows);
    }
  );
}

export default CurrencyDay;
