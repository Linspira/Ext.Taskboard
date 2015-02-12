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

// // Initialize application
Ext.onReady(function () {

    var userStore = new Kanban.data.ResourceStore({
        sorters : 'Name',

        data : [
            { Id : 1, Name : 'Mats', ImageUrl : '../resources/images/mats.jpeg' },
            { Id : 2, Name : 'Homer', ImageUrl : '../resources/images/homer.jpg' },
            { Id : 3, Name : 'Brian', ImageUrl : '../resources/images/brian.jpeg'},
            { Id : 8, Name : 'That guy', ImageUrl : '../resources/images/unknown.gif'}
        ]
    });

    var taskStore = new Kanban.data.TaskStore({
        data : [
            { Id : 1, Name : 'Fix IE7 bug', State : 'NotStarted', ResourceId : 1 },
            { Id : 2, Name : 'Sneak-install Chrome Frame', State : 'NotStarted', ResourceId : 1},
            { Id : 3, Name : 'Add Windows Phone support', State : 'InProgress', ResourceId : 3},
            { Id : 4, Name : 'Make App', State : 'InProgress' },
            { Id : 5, Name : 'Find Unicorn', State : 'Test', ResourceId : 2},
            { Id : 6, Name : 'IE6 support', State : 'InProgress'},
            { Id : 7, Name : 'Chrome development', State : 'Done' },
            { Id : 8, Name : 'Find holy grail', State : 'Done'},
            { Id : 15, Name : 'Uninstall IE', State : 'Done', Cls : 'special'}
        ]
    });

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : userStore,
        taskStore     : taskStore,
        region        : 'center',
        padding       : '0 10 10 10',

        editor : new Kanban.editor.SimpleEditor({
            dataIndex : 'Name'
        }),

        userMenu : new Kanban.menu.UserMenu({
            resourceStore : userStore
        }),

        viewConfig    : {
            multiSelect : true,
            plugins     : {
                xclass : 'Ext.ux.DataView.DragSelector'
            }
        },

        // Configure each state column individually
        columnConfigs : {
            all : {
                iconCls : 'sch-header-icon'
            },

            "NotStarted" : {
                dockedItems : {
                    xtype   : 'container',
                    dock    : 'bottom',
                    layout  : 'fit',
                    border  : 0,
                    padding : '5 8',
                    items   : {
                        height : 30,

                        xtype : 'addnewfield',
                        store : taskStore
                    }
                }
            }
        },

        dockedItems : [
            {
                xtype   : 'container',
                dock    : 'top',
                cls     : 'the-toolbar',
                height  : 50,
                region  : 'north',
                border  : 0,
                padding : '8 21',
                items   : [
                    {
                        xtype   : 'button',
                        scale   : 'large',
                        text    : 'Remove all tasks',
                        handler : function () {
                            taskStore.removeAll();
                        }
                    }
                ]
            }
        ]
    });

    var vp = new Ext.Viewport({
        items  : taskBoard,
        layout : 'fit'
    });
});
