var records = [
   { id: 1, username: 'fullmetal', password: 'password', role:'admin', displayName: 'Fullmetal', emails: [ { value: 'fullmetal@yahoo.com' }, {value: 'jason@google.com'} ] }
   ,{ id: 2, username: 'fullmetal2', password: 'newPassword', role:'user', displayName: 'FullMetal', emails: [ { value: 'fullmetal@yahoo.com' }, {value: 'jason@google.com'} ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
