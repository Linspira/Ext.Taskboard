StartTest(function(t) {

    var sched = t.getTaskBoard({
        renderTo    : document.body
    });

    t.it('should fire refresh when resourceStore is refreshed', function(t){
        t.firesOnce(sched, 'refresh');

        t.chain(
            { waitFor : 'tasksVisible' },

            function() {

                sched.resourceStore.loadData([]);
            }
        )
    })
})
