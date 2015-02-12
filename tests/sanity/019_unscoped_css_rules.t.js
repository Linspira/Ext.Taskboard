StartTest(function (t) {

    var isGarbageBrowser = !Object.keys || ![].forEach;
    var found = 0;
    var scopingRe = /sch-/;
    var rules = Object.keys(Ext.util.CSS.getRules(true));

    if (isGarbageBrowser) return;

    rules.forEach(function (rule) {
        if (!rule.match(scopingRe)) {
            t.fail('Found unscoped rule: ' + rule);
            found++;
        }
    });

    t.is(found, 0, rules.length + ' CSS rules found. Should find only scoped rules with either "sch-xxx" or "gnt-xxx"');

    t.it('Should not find hardcoded ".x-" prefixes in our codebase', function (t) {
        var as = t.beginAsync(as);

        Ext.Ajax.request({
            url      : '../taskboard-all.js',
            callback : function (options, success, response) {
                t.endAsync(as);

                if (!success) t.fail('File [' + url + '] failed to load');

                t.todo(function(t){
                    t.unlike(response.responseText, /[^a-z=]x\-[a-z]/, 'Should use Ext.baseCSSPrefix')
                })
            }
        })
    })
})
