StartTest(function (t) {


    t.it('loadData should work, keeping order', function (t) {
        var mainStore = new Kanban.data.TaskStore({
            model   : Kanban.model.Task,
            sorters : 'Name',
            proxy   : 'memory'
        });

        var slaveStore = new Kanban.data.ViewStore({
            state       : "NotStarted",
            masterStore : mainStore,
            proxy       : 'memory'
        });

        t.is(mainStore.getCount(), 0);
        t.is(slaveStore.getCount(), 0);

        mainStore.loadData([
            { Id : 1, Name : 'foo' },
            { Id : 2, Name : 'bar' },
            { Id : 3, Name : 'baz' }
        ])

        t.is(slaveStore.getCount(), 3);
        t.is(slaveStore.getCount(), 3);
        t.is(slaveStore.getAt(0).data.Name, 'bar');
        t.is(slaveStore.getAt(1).data.Name, 'baz');
        t.is(slaveStore.getAt(2).data.Name, 'foo');

        mainStore.loadData([
            { Id : 1, Name : 'foo', State : "InProgress" },
            { Id : 2, Name : 'baz' },
            { Id : 3, Name : 'bar' }
        ])

        t.is(slaveStore.getCount(), 2);

        t.is(slaveStore.getAt(0).data.Name, 'bar');
        t.is(slaveStore.getAt(1).data.Name, 'baz');
    })

    t.it('existing data', function (t) {
        var store = new Kanban.data.TaskStore({
            sorters : 'Name',
            proxy   : 'memory',
            data : [
                { Id : 1, Name : 'foo', State : "InProgress" },
                { Id : 2, Name : 'baz' },
                { Id : 3, Name : 'bar' }
            ]
        });

        var slaveStore = new Kanban.data.ViewStore({
            state       : "NotStarted",
            masterStore : store,
            proxy       : 'memory'
        });

        t.is(slaveStore.getCount(), 2);

        t.is(slaveStore.getAt(0).data.Name, 'bar');
        t.is(slaveStore.getAt(1).data.Name, 'baz');
    })

    t.it('Removing records', function (t) {
        var store = new Kanban.data.TaskStore({
            sorters : 'Name',
            proxy   : 'memory',
            data : [
                { Id : 1, Name : 'foo', State : "InProgress" },
                { Id : 2, Name : 'baz' },
                { Id : 3, Name : 'bar' }
            ]
        });

        var slaveStore = new Kanban.data.ViewStore({
            state       : "NotStarted",
            masterStore : store,
            proxy       : 'memory'
        });
        t.is(slaveStore.getCount(), 2);

        store.removeAt(1)

        t.is(slaveStore.getCount(), 1);

        t.is(slaveStore.getAt(0).data.Name, 'bar');
    })

    t.it('Filtering records', function (t) {
        var store = new Kanban.data.TaskStore({
            sorters : 'Name',
            proxy   : 'memory',
            data : [
                { Id : 1, Name : 'foo', State : "InProgress" },
                { Id : 2, Name : 'baz' },
                { Id : 3, Name : 'bar' }
            ]
        });

        var slaveStore = new Kanban.data.ViewStore({
            state       : "NotStarted",
            masterStore : store,
            proxy       : 'memory'
        });
        t.is(slaveStore.getCount(), 2);

        store.filterBy(function() { return false; })

        t.is(slaveStore.getCount(), 0);

        store.clearFilter()

        t.is(slaveStore.getCount(), 2);

        store.removeAll();

        t.is(slaveStore.getCount(), 0);
    })

    t.it('Adding records', function (t) {
        var store = new Kanban.data.TaskStore({
            sorters : 'Name',
            proxy   : 'memory',
            data : [
                { Id : 1, Name : 'foo', State : "InProgress" },
                { Id : 2, Name : 'baz' },
                { Id : 3, Name : 'bar' }
            ]
        });

        var slaveStore = new Kanban.data.ViewStore({
            state       : "NotStarted",
            masterStore : store,
            proxy       : 'memory'
        });
        t.is(slaveStore.getCount(), 2);

        store.add({ Id : 4, Name : 'bar' })

        t.is(slaveStore.getCount(), 3);

        store.add([{ Id : 5, Name : 'bar' }, { Id : 6, Name : 'bar', State : 1 }])
        t.is(slaveStore.getCount(), 4, 'Only 1 new record matching State');

    })

    t.it('Updating records', function (t) {
        var store = new Kanban.data.TaskStore({
            sorters : 'Name',
            proxy   : 'memory',
            data : [
                { Id : 1, Name : 'foo', State : "InProgress" },
                { Id : 2, Name : 'baz' },
                { Id : 3, Name : 'bar' }
            ]
        });

        var slaveStore0 = new Kanban.data.ViewStore({
            state       : "NotStarted",
            masterStore : store,
            proxy       : 'memory'
        });

        var slaveStore1 = new Kanban.data.ViewStore({
            state       : "InProgress",
            masterStore : store,
            proxy       : 'memory'
        });

        var slaveStore2 = new Kanban.data.ViewStore({
            state       : "Test",
            masterStore : store,
            proxy       : 'memory'
        });

        t.is(slaveStore0.getCount(), 2);
        t.is(slaveStore1.getCount(), 1);
        t.is(slaveStore2.getCount(), 0);

        var first = store.getById(1);

        store.getById(1).setState("Test");

        t.is(slaveStore0.getCount(), 2);
        t.is(slaveStore1.getCount(), 0);
        t.is(slaveStore2.getCount(), 1);

        t.is(slaveStore2.first(), first);
        t.is(first.stores.length, 2);
    })
})
