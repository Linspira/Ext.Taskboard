describe('Subclassing', function (t) {

    t.it('Should be possible to subclass the panel', function (t) {

        Ext.define('Ext.ux.Sub', {
            extend              : 'Kanban.view.TaskBoard',

            columns             : [
                { text : 'foo', state : 'NotStarted' }
            ],

            readOnly            : false,
            stateful            : false
        });

        var s = new Ext.ux.Sub({
            taskStore : new Kanban.data.TaskStore(),
            resourceStore : new Kanban.data.ResourceStore({ proxy : 'memory' }),

            viewConfig : {
                foo : 'bar'
            }
        });

        s.destroy();

        new Ext.ux.Sub({
            renderTo      : document.body,
            taskStore : new Kanban.data.TaskStore({ proxy : 'memory' }),
            resourceStore : new Kanban.data.ResourceStore({ proxy : 'memory' })
        }).destroy();
    })
})
