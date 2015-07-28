var http = require('http');

module.exports = function (url, cb) {
  return http.get(url, function (res) {
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