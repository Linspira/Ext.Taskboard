describe('Kanban.view.TaskBoard API tests', function (t) {

    t.it('Basic API calls', function (t) {
        var sched = t.getTaskBoard({
            renderTo : document.body,

            taskStore : new Kanban.data.TaskStore({
                data : [
                    { Id : 1, Name : 'TestGuy', Cls : 'task'}
                ]
            })
        });

        t.chain(
            { waitForTasksVisible : sched },

            function () {
                var taskEl = sched.el.down('.task');

                t.ok(taskEl, 'found task el');

                t.is(sched.getElementForTask(sched.taskStore.first()), taskEl, 'getElementForTask using record');
                t.is(sched.getElementForTask(1), taskEl, 'getElementForTask using id');

                sched.select([sched.taskStore.first()]);

                t.is(sched.views[0].getSelectionModel().selected.getCount(), 1, '1 selected in 1st col');
                t.is(sched.views[1].getSelectionModel().selected.getCount(), 0, '0 selected in 2nd col');
                t.is(sched.views[2].getSelectionModel().selected.getCount(), 0, '0 selected in 3rd col');
                t.is(sched.views[3].getSelectionModel().selected.getCount(), 0, '0 selected in 4th col');

                sched.destroy();
            }
        )
    })

    t.it('Basic config properties', function (t) {
        Ext.define('MyCol', { extend : Kanban.view.TaskColumn, alias : 'widget.mycol' });
        t.expectGlobal('MyCol');

        var sched = t.getTaskBoard({
            columnClass : 'MyCol'
        });

        t.is(sched.query('mycol').length, 4, 'Could use the columnClass config');

        var sched = t.getTaskBoard({
            columns : [
                {
                    state : 'Foo'
                },
                {
                    state : 'Bar'
                }
            ]
        });

        t.ok('mycol[State=Foo]', 'Could use the columns config');
        t.ok('mycol[State=Bar]', 'Could use the columns config');

        sched.destroy();
    })

    t.it('Specifying editor config', function (t) {
        var sched = t.getTaskBoard({
            renderTo : document.body,
            editor   : {
                xtype : 'kanban_simpleeditor',
                foo   : 'bar'
            }
        });

        t.isInstanceOf(sched.editor, Kanban.editor.SimpleEditor, 'Should be able to use xtype for editor');

        sched.destroy();
    })

    t.describe('"taskclick", "taskdblclick" and "taskcontextmenu" events should be fired when clicking tasks', function (t) {
        var panel = t.getTaskBoard({
            renderTo : document.body
        });

        t.it('taskclick', function (t) {
            t.willFireNTimes(panel, 'taskclick', 1);

            t.chain(
                { click : '.sch-task' }
            );
        });

        t.it('taskdblclick', function (t) {
            t.willFireNTimes(panel, 'taskcontextmenu', 1);

            t.chain(
                { rightclick : '.sch-task' }
            );
        });

        t.it('taskcontextmenu', function (t) {
            t.willFireNTimes(panel, 'taskdblclick', 1);

            t.chain(
                { doubleclick : '.sch-task' }
            );
        });
    });
})
