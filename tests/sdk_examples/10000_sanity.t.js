StartTest(function(t) {
    var scripts = Ext.select('script', Ext.getHead());
    var foundComponentScript = false;
    var foundExt = false;
    
    scripts.each(function(el) {
        if (el.dom.src && el.dom.src.match(/taskboard-all-debug\.js/)){
            foundComponentScript = true;
        }

        if (el.dom.src && el.dom.src.match(/cdn\.sencha\.(io|com)/) && el.dom.src.match('ext-all.js')){
            foundExt = true;
        }
    });

    t.ok(foundComponentScript, 'Script tag with taskboard-all-debug.js found');

    t.ok(foundExt, 'ext-all.js script tag using cdn.sencha.io found');

    t.waitForSelector('.sch-task', function() {
        t.pass('Example rendered without exception');

        var taskboard = t.cq1('taskboard');

        t.monkeyTest('>>taskboard', 10);
    });
});
