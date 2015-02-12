Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Sch'    : '../../lib/Sch',
        'Kanban' : '../../lib/Kanban'
    }
});

Ext.require([
    'Kanban.view.TaskBoard'
]);


Ext.define('MyTask2', {
    extend : 'Kanban.model.Task',

    states            : [
        'NotStarted',
        'InProgress',
        'Testing',
        'TestingDone',
        'Done'
    ],

    // Move tasks freely
    isValidTransition : function (state) {
        return true;
    }
})

Ext.define('MyTask3', {
    extend : 'Kanban.model.Task',

    states            : [
        'Backlog',
        'NoStarted',
        'InProgress',
        'Test',
        'Done'
    ],
    // Move tasks freely
    isValidTransition : function (state) {
        return true;
    }
})

Ext.onReady(function () {

    var resourceStore = new Kanban.data.ResourceStore({
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : 'users.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });


    var taskStore = new Kanban.data.TaskStore({
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : 'tasks.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });

    var taskStore2 = new Kanban.data.TaskStore({
        model    : MyTask2,
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : 'tasks.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });

    var taskStore3 = new Kanban.data.TaskStore({
        model    : MyTask3,
        sorters  : 'Name',
        autoLoad : true,
        proxy    : {
            type : 'ajax',

            api : {
                read    : 'tasks.js',
                update  : undefined,
                destroy : undefined,
                create  : undefined
            }
        }
    });


    var vp = new Ext.Viewport({
        layout : 'border',
        items  : [
            {
                xtype       : 'container',
                cls         : 'the-toolbar',
                height      : 50,
                region      : 'north',
                border      : 0,
                padding     : '5 0 ',
                defaultType : 'button',
                defaults    : { margin : '0 0 0 10', scale : 'large' },

                items : [
                    {
                        text    : '4 basic columns',
                        handler : function () {
                            vp.down('[region=center]').getLayout().setActiveItem(0);
                        }
                    },
                    {
                        text    : '3 basic columns + 1 split',
                        handler : function () {
                            vp.down('[region=center]').getLayout().setActiveItem(1);
                        }
                    },
                    {
                        text    : '4 horizontal, 1 vertical',
                        handler : function () {
                            vp.down('[region=center]').getLayout().setActiveItem(2);
                        }
                    }
                ]
            },
            {
                region   : 'center',
                border   : false,
                layout   : 'card',
                defaults : {
                    xtype     : 'taskboard',
                    taskStore : taskStore,
                    resourceStore : resourceStore
                },
                items    : [
                    {
                        // Just the defaults please...
                        cls : 'panel-1'
                    },
                    {
                        cls       : 'panel-2',
                        taskStore : taskStore2,
                        defaults  : {
                            header  : { height : 46 },
                            iconCls : '',
                            margin  : 0
                        },
                        columns   : [
                            {
                                state : 'NotStarted',
                                title : 'Not Started'
                            },
                            {
                                state : 'InProgress',
                                title : 'In Progress'
                            },
                            {
                                xtype    : 'panel',
                                header   : { height : 22 },
                                title    : 'All kinds of tests',
                                cls      : 'split',
                                flex     : 1,
                                layout   : { type : 'hbox', align : 'stretch' },
                                defaults : {
                                    xtype     : 'taskcolumn',
                                    flex      : 1,
                                    iconCls   : '',
                                    header    : { height : 23, padding : 0 }
                                },
                                items    : [
                                    {
                                        state     : 'Testing',
                                        title     : 'Doing',
                                        border    : false,
                                        bodyStyle : 'border-right:1px dashed #aaa !important'
                                    },
                                    {
                                        state  : 'TestingDone',
                                        title  : 'Done',
                                        border : false
                                    }
                                ]
                            },
                            {
                                state     : 'Done',
                                title     : 'Done',
                                zoomLevel : 'mini'
                            }
                        ]
                    },
                    {
                        xtype     : 'taskboard',
                        layout    : 'border',
                        cls       : 'panel-3',
                        taskStore : taskStore3,
                        columns   : [
                            {
                                region   : 'center',
                                xtype    : 'container',
                                layout   : { type : 'hbox', align : 'stretch' },
                                defaults : { flex : 1, xtype : 'taskcolumn' },
                                items    : [
                                    {
                                        state : 'NotStarted',
                                        title : 'Not Started'
                                    },
                                    {
                                        state : 'InProgress',
                                        title : 'In Progress'
                                    },
                                    {
                                        state : 'Test',
                                        title : 'Test'
                                    },
                                    {
                                        state : 'Done',
                                        title : 'Done'
                                    }
                                ]
                            },
                            {
                                region    : 'south',
                                flex      : null,
                                zoomLevel : 'small',
                                state     : 'Backlog'
                            }

                        ]
                    }
                ]
            }
        ]
    });
});
