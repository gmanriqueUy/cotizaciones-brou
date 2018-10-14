import HTTP_STATUS from '../constants/http-status';

export default function internalError(err, res) {
  return res.status(HTTP_STATUS.INTERNAL_ERROR).send(err);
}
