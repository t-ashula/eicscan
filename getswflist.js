/*
 
*/

'use strict';

var system = require('system'),
    page = require('webpage').create();
var url = system.args[1];

console.error = function () {
    system.stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2143.0 Safari/537.36';
page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var files = page.evaluate(function () {
            var  _map = Array.prototype.map;
            var embs = _map.call( document.querySelectorAll("embed[type='application/x-shockwave-flash']"), function(e){ return e.src; } ),
                objs = _map.call( document.querySelectorAll("object[type='application/x-shockwave-flash']"), function(o){ return o.data; });
            return embs.concat(objs);
        });
        console.log(files);
    }
    phantom.exit();
});

