import db from '../config/db-connection';

const Currency = {
  list,
  getByIso
};

function getByIso(iso,cb) {

  db.connection().query(
    `SELECT *
    FROM currency
    WHERE UPPER(iso) = UPPER(?)`,
    iso,
    (err, results) => {
      if(err) return cb(err);

      if(results.length !== 1) {
        return cb();
      }

      return cb(null, results[0]);
    }
  );
}

function list(cb) {

  db.connection().query(
    `SELECT *
    FROM currency`,
    (err, results) => {
      if(err) return cb(err);

      return cb(null, results);
    }
  );
}

export default Currency;
