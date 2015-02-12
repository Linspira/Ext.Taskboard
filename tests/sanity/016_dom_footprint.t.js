StartTest({
    forceDOMVisible     : true
}, function(t) {
    var sched = t.getTaskBoard({
        renderTo    : document.body
    });

    t.chain(
        { waitFor : 'tasksVisible' },

        { action : 'drag', target : '.sch-task', to : '.sch-taskcolumn-state-NotStarted' },

        function() {
            t.selectorNotExists('[class*="undefined"]', 'No "undefined" class selectors found in DOM')
            t.selectorNotExists('[id*="undefined"]', 'No "undefined" ids found in DOM')
            t.selectorNotExists('[class*="null"]', 'No "null" class selectors found in DOM')
            t.selectorNotExists('[id*="null"]', 'No "null" ids found in DOM')

            sched.destroy();
            t.selectorNotExists('[class*="sch-"]', 'No sch-XXX selectors found in DOM')
        }
    )
})
