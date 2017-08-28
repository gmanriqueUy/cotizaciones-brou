import mysql  from 'mysql';
import DB from '../constants/db';

let _pool = null,
_connection = null,

db = {
  connect: connect,
  connection: getConnection,
  beginTransaction: beginTransaction,
  commit: commit,
  rollback: rollback
}

/**
 * Returns a connection to db
 * @param {function} cb - The callback
 */
function connect(cb) {
  _pool = mysql.createPool(DB);
  cb();
}

/**
 * Returns a connection
 * @returns {Mysql~Connection} The connection
 */
function getConnection() {
  return _connection || _pool;
}

/**
 * Begins a database transaction
 * 
 * @param {function} cb - The callback
 */
function beginTransaction(cb) {
  _pool.getConnection(function(err,connection) {
    if(err) throw err;
    _connection = connection;
    _connection.beginTransaction(cb);
  });
}

/**
 * Commit the changes
 * @param {function} cb - The callback
 */
function commit(cb) {
  _connection.commit(function(err) {
    if(err){
      _connection.rollback(function() {
        _connection.release();
        _connection = null;
        cb(err);
      })
    }else{
      _connection && _connection.release();
      _connection = null;
      cb();
    }
  })
}

/**
 * Rollback the changes
 * 
 * @param {function} cb - The callback
 */
function rollback(cb) {
  _connection.rollback(function() {
    _connection.release();
    _connection = null;
    cb();
  });
}

export default db;
