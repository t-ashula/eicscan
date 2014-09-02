var system = require('system'),
    page = require('webpage').create();
var url = system.args[1], errStacks = [];

console.error = function () {
    system.stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

// Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.0.0 (development) Safari/538.1
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2143.0 Safari/537.36';
page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }
    errStacks.push(msgStack.join('\n'));
};

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var files = page.evaluate(function () {
            return document.title;
        });
        console.log(files);
    }
    console.log('');
    if ( errStacks.length > 0 ) {
        console.error(errStacks);
    }
    phantom.exit();
});
