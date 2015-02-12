StartTest({
    overrideSetTimeout : false
},function (t) {

    var tests = t.harness.flattenDescriptors(t.harness.descriptors);

    // Remove the smoketest 'test' first
    tests.pop();

    // Redefine StartTest (called in each loaded script file), where we just return a ref to the test script function itself
    // So we can call it manually
    window.StartTest = window.startTest = window.describe = function(fnOrCfg, fn) {
        return (typeof fnOrCfg === "function") ? fnOrCfg : fn;
    };
    
    var responses   = []

    tests.forEach(function (test, i) {
        Ext.Ajax.request({
            url     : test.url,
            success : function(response) {
                responses[ i ] = response.responseText
            }
        })
    })
    
    var currentTest     = 0
    
    var waitForPresence = function (index, done) {
        if (responses[ index ] != null) 
            done(responses[ index ])
        else
            setTimeout(function () {
                waitForPresence(index, done)
            }, 50)
    }
    
    var async   = t.beginAsync()
    
    var processTests    = function () {
        waitForPresence(currentTest, function (text) {
            t.subTest(
                tests[ currentTest ].id, 
                function (t) {
                    eval(text)(t);
                }, 
                function () {
                    currentTest++
                    if (currentTest < tests.length) 
                        processTests()
                    else
                        t.endAsync(async)
                }
            )
        })
    }
    
    processTests()
})
