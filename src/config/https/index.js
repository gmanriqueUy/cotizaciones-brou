import fs from 'fs';

export default {
  key  : fs.readFileSync('config/https/server.key'),
  cert : fs.readFileSync('config/https/server.crt'),
  ca   : fs.readFileSync('config/https/fullchain.pem')
};
