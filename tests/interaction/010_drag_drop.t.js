StartTest(function(t) {

    t.it('single task drag', function(t) {

        var sched = t.getTaskBoard({
            renderTo    : document.body,
            height      : 200,
            taskStore   : new Kanban.data.TaskStore({

                data  : [
                    { Id : 1, Name : 'TestGuy', Cls : 'task'}
                ]
            })
        });

        var rec = sched.taskStore.first();

        function validate(state) {

            return function(next) {
                t.is(rec.data.State, state, 'Correct state after drag - ' + state);
                next()
            }
        }

        t.chain(
            { drag : '.task', to : '>>taskview[state=InProgress]', toOffset : ['50%', 10] }, validate("InProgress"),

            { drag : '.task', to : '>>taskview[state=Test]', toOffset : ['50%', 10] },       validate("Test"),

            { drag : '.task', to : '>>taskview[state=Done]', toOffset : ['50%', 10] },       validate("Done"),

            { drag : '.task', to : '>>taskview[state=Test]', toOffset : ['50%', 10] },       validate("Test"),

            { drag : '.task', to : '>>taskview[state=InProgress]', toOffset : ['50%', 10] }, validate("InProgress"),

            { drag : '.task', to : '>>taskview[state=NotStarted]', toOffset : ['50%', 10] }, validate("NotStarted")
        )
    })

    t.it('Multiple task drag', function(t) {

        var sched = t.getTaskBoard({
            renderTo    : document.body,
            multi       : 1,
            height      : 200,
            width       : 500,
            taskStore   : new Kanban.data.TaskStore({

                data  : [
                    { Id : 1, Name : 'TestGuy', Cls : 'task2'},
                    { Id : 2, Name : 'TestGuy', Cls : 'task2' },
                    { Name : 'TestGuy', Cls : 'task2'} // Phantom task
                ]
            })
        });

        var task1 = sched.taskStore.getById(1);
        var task2 = sched.taskStore.getById(2);
        var task3 = sched.taskStore.last();

        function afterDrop(state) {

            return function(next) {
                t.is(task1.data.State, state, 'Correct state after drag - ' + state);
                t.is(task2.data.State, state, 'Correct state after drag - ' + state);
                t.is(task3.data.State, state, 'Correct state after drag - ' + state);

                sched.select([task1, task2, task3]);

                next()
            }
        }

        sched.select([task1, task2, task3]);

        t.chain(
            { drag : '.task2', to : '>>[multi] taskview[state=InProgress]', toOffset : ['50%', 10] },
            { waitFor : 100 },
            afterDrop("InProgress"),

            { drag : '.task2', to : '>>[multi]  taskview[state=Test]', toOffset : ['50%', 10] },
            { waitFor : 100 },
            afterDrop("Test"),

            { drag : '.task2', to : '>>[multi] taskview[state=Done]', toOffset : ['50%', 10] },
            { waitFor : 100 },
            afterDrop("Done"),

            { drag : '.task2', to : '>>[multi] taskview[state=Test]', toOffset : ['50%', 10] },
            { waitFor : 100 },
            afterDrop("Test"),

            { drag : '.task2', to : '>>[multi] taskview[state=InProgress]', toOffset : ['50%', 10] },
            { waitFor : 100 },
            afterDrop("InProgress"),

            { drag : '.task2', to : '>>[multi] taskview[state=NotStarted]', toOffset : ['50%', 10] },
            { waitFor : 100 },
            afterDrop("NotStarted")
        )
    })


})
