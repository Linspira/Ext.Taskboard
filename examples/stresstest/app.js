Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Sch'       : '../../lib/Sch',
        'Kanban'    : '../../lib/Kanban'
    }
});

Ext.require([
    'Kanban.view.TaskBoard'
]);

// // Initialize application
Ext.onReady(function () {

    var resourceStore = new Kanban.data.ResourceStore({
        data : (function() {
            var arr = [];

            for (var i = 0; i < 100; i++) { arr.push({ Id : i, Name : 'task ' + i }); }

            return arr;
        })()
    })

    var taskStore = new Kanban.data.TaskStore({
        data : (function() {
            var arr = [];
            for (var i = 0; i < 1000; i++) { arr.push({ Id : i, Name : 'task ' + i, State : Kanban.model.Task.prototype.states[i % 4] }); }
            return arr;
        })()
    });

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore     : resourceStore,
        taskStore     : taskStore,
        region        : 'center',
        padding       : 10
    });

    var vp = new Ext.Viewport({
        items  : taskBoard,
        layout : 'fit'
    });
});
