/*
 
*/

'use strict';

var system = require('system'),
  page = require('webpage').create();
var url = system.args[1];

// https://github.com/ariya/phantomjs/issues/10150#issuecomment-28707859
console.error = function () {
  system.stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2143.0 Safari/537.36';
page.onError = function (msg, trace) {
  var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function (t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
};

page.onInitialized = function () {
  page.evaluate(function () {
    // fake plugins for SWFObj.js
    {
      navigator.plugins = navigator.plugins || {};
      navigator.plugins['Shockwave Flash'] = navigator.plugins['Shockwave Flash'] || {
        description: 'Shockwave Flash 14.0 r0'
      };
      navigator.mimeTypes = navigator.mimeTypes || {};
      navigator.mimeTypes['application/x-shockwave-flash'] = navigator.mimeTypes['application/x-shockwave-flash'] || {
        enabledPlugin: true
      };
    }
  });
};

page.open(url, function (status) {
  if (status !== 'success') {
    console.log('Unable to access network');
    phantom.exit();
  }
  else {
    setTimeout(function () {
      var files = page.evaluate(function () {
        var _map = Array.prototype.map, _filter = Array.prototype.filter, _qsa = function(s){ return document.querySelectorAll(s); };
        var embs = _filter.call(_qsa('embed[type]'), function(e){ return e.getAttribute('type').match(/application\/x-shockwave-flash/i); }),
            objs = _filter.call(_qsa('object[type]'),function(e){ return e.getAttribute('type').match(/application\/x-shockwave-flash/i); }),
            objs2 = _filter.call(_qsa('object[classid]'), function(e){ return e.getAttribute('classid').match(/clsid:d27cdb6e-ae6d-11cf-96b8-444553540000/i); }),
            params = _filter.call(_qsa('param[name]'), function(e){ return e.getAttribute('name').match(/movie/i); });
        var files = [].concat(_map.call(embs, function (e) {
            return e.src;
          }))
          .concat(_map.call(objs, function (o) {
            return o.data;
          }))
          .concat(_map.call(objs2, function (o) {
            return o.data;
          }))
          .concat(_map.call(params, function (p) {
            return p.value;
          }))
          .filter(function (u) {
            return u !== '';
          })
          .map(function (u) {
            try {
              var a = document.createElement('a');
              a.href = u;
              return a.href;
            }
            catch (e) {
              return u;
            }
          });
          return files;
      }) || [];
      console.log(files.join('\n'));
      phantom.exit();
    }, 1000);
  }
});
