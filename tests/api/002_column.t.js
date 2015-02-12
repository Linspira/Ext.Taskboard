describe('Kanban.view.TaskColumn API tests', function (t) {

    t.it('Basic config properties', function (t) {
       var column = new Kanban.view.TaskColumn({
           state      : 'a',
           viewConfig : { foo : 'bar' },
           store      : new Kanban.data.TaskStore({
               data : [
                   { State : 'a', Id : 1}
               ]
           }),
           renderTo   : document.body
       })

        column.bindStore(
            new Kanban.data.ViewStore({
                masterStore : column.store,
                state       : column.state
            })
        );

        t.is(column.state, 'a', 'state is ok')
        t.is(column.view.foo, 'bar', 'viewConfig is ok');
        t.is(column.getHeader().title, 'a (1)', 'Header title is ok');
        t.hasCls(column.el, 'sch-taskcolumn-state-a')
    })
})
