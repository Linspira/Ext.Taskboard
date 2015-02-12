StartTest(function(t) {

    var task = new Kanban.model.Task({ Id : "InProgress", Name : 'TestGuy', Cls : 'task'})

    t.is(task.getState(), 'NotStarted', 'Default state is NotStarted');

    t.ok(task.isValidTransition("InProgress"), '"NotStarted"->"InProgress"');
    t.notOk(task.isValidTransition("Test"), '"NotStarted"->"Test"');
    t.notOk(task.isValidTransition("Done"), '"NotStarted"->"Done"');

    task.setState("InProgress")

    t.ok(task.isValidTransition("NotStarted"), '"InProgress"->"NotStarted"');
    t.ok(task.isValidTransition("Test"), '"InProgress"->"Test"');
    t.notOk(task.isValidTransition("Done"), '"InProgress"->"Done"');

    task.setState("Test")

    t.notOk(task.isValidTransition("NotStarted"), '"Test"->"NotStarted"');
    t.ok(task.isValidTransition("InProgress"), '"Test"->"InProgress"');
    t.ok(task.isValidTransition("Done"), '"Test"->"Done"');

    task.setState("Done")

    t.notOk(task.isValidTransition("NotStarted"), '"Done"->"NotStarted"');
    t.ok(task.isValidTransition("InProgress"), '"Done"->"InProgress"');
    t.ok(task.isValidTransition("Test"), '"Done"->"Test"');
})
