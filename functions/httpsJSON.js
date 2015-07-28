var https = require('https');

module.exports = function (options, cb) {
  return https.get(options, function (res) {
    var data = [];
    res.on('data', function (chunk) {
      data.push(chunk);
    });

    res.on('end', function () {
      return cb(null, JSON.parse(Buffer.concat(data).toString()));
    });
    res.on('error', cb);
  }).on('error', cb);
}