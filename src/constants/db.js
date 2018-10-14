const JAWSDB_MARIA_URL = process.env.JAWSDB_MARIA_URL

export default JAWSDB_MARIA_URL || {
  connectionLimit: 20,
  user: 'cotizacionesBrou',
  password: 'cotizacionesBrou',
  socketPath: '/var/run/mysqld/mysqld.sock',
  host: 'localhost',
  database: 'cotizacionesBrou',
  timezone: 'Z'
}
