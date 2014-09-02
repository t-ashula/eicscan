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
        phantom.exit();
    } else {
        setTimeout(function(){
            var files = page.evaluate(function () {
                var _map = Array.prototype.map;
                var embs = document.querySelectorAll('embed[type="application/x-shockwave-flash"]'), 
                    objs1 = document.querySelectorAll('object[type="application/x-shockwave-flash"]'),
                    objs2 = document.querySelectorAll('object[classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"]'),
                    params = document.querySelectorAll('param[name="movie"]');
                var files = [].concat(_map.call(embs, function(e){ return e.src; }))
                        .concat(_map.call(objs1,  function(o){ return o.data; }))
                        .concat(_map.call(objs2,  function(o){ return o.data; }))
                        .concat(_map.call(params, function(p){ return p.value; }))
                        .filter(function(u){return u !== ''; })
                        .map(function(u){ 
                            try{
                                var a = document.createElement('a'); 
                                a.href = u;
                                return a.href;
                            }catch(e){
                                return u;
                            }
                        });
                return files;
            });
            console.log(files);
            phantom.exit();
        }, 1000);
    }
});

