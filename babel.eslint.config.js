const { plugins } = require('./babel.config');

module.exports = function(api) {
  api.cache(true);

  return { plugins };
};