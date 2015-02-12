Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Sch'    : '../../lib/Sch',
        'Kanban' : '../../lib/Kanban'
    }
});

Ext.require([
    'Kanban.view.TaskBoard',
    'Kanban.field.TaskFilter',
    'Kanban.field.TaskHighlight',
    'Kanban.field.ColumnFilter',
    'Kanban.menu.UserPictureMenu'
]);

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

    Ext.define('MyTask', {
        extend : 'Kanban.model.Task',

        fields : [
            { name : 'NbrComments', type : 'int' },
            { name : 'Attachments', type : 'int' }
        ],

        states            : [
            'NotStarted',
            'InProgress',
            'Test',
            'Acceptance',
            'Done'
        ],

        // Move tasks freely
        isValidTransition : function (state) {
            return true;
        }
    })

    var taskStore = new Kanban.data.TaskStore({
        model    : MyTask,
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

    Kanban.locale.En.Acceptance = 'Acceptance';

    Ext.define('MyKanbanPanel', {
        extend  : 'Kanban.view.TaskBoard',
        region  : 'center',
        padding : '0 10 10 10',

        initComponent : function () {

            Ext.apply(this, {
                viewConfig : {
                    multiSelect : true,
                    plugins     : {
                        xclass : 'Ext.ux.DataView.DragSelector'
                    },

                    taskToolTpl : '<div class="sch-tool-ct">' +
                        '<div class="sch-tool sch-tool-edit"></div>' +
                        '<tpl if="NbrComments"><div class="sch-tool sch-tool-with-text sch-tool-comment">{NbrComments}</div></tpl>' +
                        '<tpl if="Attachments"><div class="sch-tool sch-tool-with-text sch-tool-attachment">{Attachments}</div></tpl>' +
                        '</div>',

                    taskRenderer : function (task, renderData) {
                        if (task.getName() === 'Uninstall IE5') {
                            renderData.style = 'background:red;color:#fff';
                        }
                    }
                },

                defaults : {
                    iconCls : 'sch-header-icon',
                    tools   : [
                        {
                            type    : 'left',
                            handler : function () {
                                var pnl = this.up('panel');

                                if (this.type === 'left') {
                                    pnl.flex = 0.5;
                                    pnl.setZoomLevel('small')
                                    this.setType('right');
                                } else {
                                    pnl.flex = 1;
                                    pnl.setZoomLevel('large')
                                    this.setType('left');
                                }

                                pnl.ownerCt.doLayout();
                            }
                        }
                    ]
                },

                columns : [
                    {
                        state       : 'NotStarted',
                        title       : 'Not Started',
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
                    },

                    {
                        state : 'InProgress',
                        title : 'In Progress'
                    },

                    {
                        xtype    : 'container',
                        flex     : 1,
                        layout   : { type : 'vbox', align : 'stretch' },
                        defaults : { xtype : 'taskcolumn', flex : 1 },
                        items    : [
                            {
                                state : 'Test',
                                title : 'Test'
                            },
                            {
                                state     : 'Acceptance',
                                title     : 'Acceptance',

                                // Column-level zoom setting
                                zoomLevel : 'mini'
                            }
                        ]
                    },
                    {
                        state : 'Done',
                        title : 'Done'
                    }
                ],

                userMenu : new Kanban.menu.UserPictureMenu({
                    resourceStore : resourceStore
                }),

                editor : new Kanban.editor.SimpleEditor({
                    dataIndex       : 'Name',
                    triggerEvent    : null // only invoked via the "edit" tool
                })
            })

            this.callParent(arguments);
        },

        afterRender : function() {
            this.callParent(arguments);

            this.el.on('click', this.onEditClick, this, { delegate : '.sch-tool-edit' });
        },

        onEditClick : function(e, t) {
            this.editor.editRecord(this.resolveRecordByNode(t));
        }
    });

    var taskBoard = new MyKanbanPanel({
        resourceStore : resourceStore,
        taskStore : taskStore
    });

    var vp = new Ext.Viewport({
        items  : [
            {
                xtype   : 'toolbar',
                cls     : 'the-toolbar',
                height  : 40,
                region  : 'north',
                border  : 0,
                padding : '5 21',

                items : [
                    {
                        xtype : 'label',
                        text  : 'Filter tasks',
                        style : 'color:#fff;margin:0 10px'
                    },
                    {
                        xtype : 'filterfield',
                        store : taskStore
                    },
                    {
                        xtype : 'label',
                        text  : 'Highlight tasks',
                        style : 'color:#fff;margin:0 10px'
                    },
                    {
                        xtype : 'highlightfield',
                        store : taskStore,
                        panel : taskBoard
                    },
                    {
                        xtype : 'label',
                        text  : 'Select columns',
                        style : 'color:#fff;margin:0 10px'
                    },
                    {
                        xtype  : 'columnfilter',
                        panel  : taskBoard,
                        height : 25
                    },
                    '->',
                    {
                        xtype : 'label',
                        text  : 'Zoom',
                        style : 'color:#fff;margin-right:5px'
                    },
                    {
                        xtype     : 'slider',
                        width     : 100,
                        increment : 0,
                        minValue  : 0,
                        maxValue  : 3,
                        value     : 4,
                        style     : 'background-color:transparent',
                        listeners : {
                            change : function (slider, val) {
                                taskBoard.setZoomLevel(val === 0 ? 'mini' : (val === 1 ? 'small' : (val === 2 ? 'medium' : 'large')));
                            }
                        }
                    }
                ]
            },
            taskBoard
        ],
        layout : 'border'
    });
});
