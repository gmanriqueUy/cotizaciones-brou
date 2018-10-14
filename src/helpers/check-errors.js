import { validationResult } from 'express-validator/check';

import HTTP_STATUS from '../constants/http-status';

export default function checkErrors(req, res, next) {

  let errors = validationResult(req).array();

  if (errors && errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST)
      .json(errors);
  }

  return next();
}
