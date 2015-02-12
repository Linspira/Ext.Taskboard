describe('Views should react correctly to store filtering', function(t) {

    var sched = t.getTaskBoard({
        renderTo    : document.body,
        taskStore   : new Kanban.data.TaskStore({
            data  : [
                { Id : 1, Name : 'TestGuy', cls : 'task'},
                { Name : 'asf', cls : 'task', State : "Test"},
                { Name : 'fasf', cls : 'task', State : "Test"},
                { Name : 'baa', cls : 'task', State : "Test"},
                { Name : 'maa', cls : 'task', State : "Done"},
                { Name : 'qwe', cls : 'task', State : "Test"},
                { Name : 'TestGuy', cls : 'task', State : "Test"}
            ]
        })
    });

    t.chain(
        { waitFor : 'tasksVisible' },

        function() {
            sched.taskStore.filterBy(function(rec) {
                return false;
            });

            Ext.each(t.cq('taskview'), function(view, index) {
                t.is(view.getNodes().length, 0, 'View empty initially - ' + index);
            })

            sched.taskStore.filterBy(function(rec) {
                return rec.getName().match('maa');
            })

            t.is(t.cq1('taskview[state=NotStarted]').getNodes().length, 0, 'View empty after filtering');
            t.is(t.cq1('taskview[state=InProgress]').getNodes().length, 0, 'View empty after filtering');
            t.is(t.cq1('taskview[state=Test]').getNodes().length, 0, 'View empty after filtering');
            t.is(t.cq1('taskview[state=Done]').getNodes().length, 1, 'View has one after filtering');
        }
    )
})
