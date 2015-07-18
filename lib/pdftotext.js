var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

function pdftotext (filename, options) {
  this.options = options || {};
  //quote filename
  this.options.additional = ['"' + filename + '"'];

  pdftotext.prototype.add_options = function(optionArray) {
    if (typeof optionArray.length !== undefined) {
        var self = this;
        optionArray.forEach(function(el) {
          if (el.indexOf(' ') > 0) {
            var values = el.split(' ');
            self.options.additional.push(values[0], values[1]);
          } else {
            self.options.additional.push(el);
          }
        });
    }
    return this;
  };

  pdftotext.prototype.getSync = function() {
    console.warn("\033[31mgetSync is now obsolete please use getTextSync instead and eventually it will be removed.\033[0m");
    return this.getTextSync();
  }

  pdftotext.prototype.getTextSync = function() {
    var self = this;
    // '-' stdout the output
    self.add_options(['-']);
    return execSync('pdftotext ' + self.options.additional.join(' '));
  };

  pdftotext.prototype.getText = function(cb) {
    var self = this;
    // '-' stdout the output
    self.add_options(['-']);
    exec('pdftotext ' + self.options.additional.join(' '), function(error, stdout, stderr) {
      if (error) {
          throw new Error(stderr);
      }

      if (cb && typeof cb === "function") {
			cb(err, stdout, self.options.addtional);
      }
    });
  };

  pdftotext.prototype.error = function(callback) {
    this.options.error = callback;
    return this;
  };

  pdftotext.prototype.success = function(callback) {
    this.options.success = callback;
    return this;
  };
}

// module exports
exports = module.exports = function(filename, args) {
  return new pdftotext(filename, args);
};
