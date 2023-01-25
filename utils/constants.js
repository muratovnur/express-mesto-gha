// коды для ответов
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const BAD_SERVER_DEFAULT = 500;

// regex паттерн для проверки url
// eslint-disable-next-line no-useless-escape
const REGEX_FOR_URL = /http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]!$&'()*+,;=]{2,256}\.[a-z]{2,6}\b([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)/;

module.exports = {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  BAD_SERVER_DEFAULT,
  UNAUTHORIZED,
  REGEX_FOR_URL,
};
