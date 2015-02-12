Class('Bryntum.Test', {

    isa : Siesta.Test.ExtJS,


    methods : {

        initialize : function() {
            this.SUPERARG(arguments);

            this.on('beforetestfinalizeearly', function() {
                var win     = this.global;

                if (win.Ext) {
                    var suspendedComponents = this.cq('{isLayoutSuspended()}');

                    // only report in case of failure
                    if (suspendedComponents.length > 0) {
                        this.diag('POST TEST SANITY CHECKS');

                        this.is(suspendedComponents.length, 0, 'No components found with layouts suspended');

                        this.fail('Suspended layouts detected for components', {
                            annotation : Ext.Array.map(suspendedComponents, function(cmp) { return (cmp.id + '(' + cmp.xtype + ') ') }).join('\r\n')
                        });
                    }

                    if (win.Ext.AbstractComponent.layoutSuspendCount > 0) {
                        this.is(win.Ext.AbstractComponent.layoutSuspendCount, 0, 'Layouts should not be suspended globally by accident');
                    }
                }
            });
        },

        isOnline : function () {
            return window.location.href.match(/bryntum\.com|ext-scheduler\.com/i)
        },

        waitForTasksVisible : function (panel, cb) {
            if (!(panel instanceof this.global.Kanban.view.TaskBoard)) {
                cb = panel;
                panel = this.cq1('taskboard');
            }
            this.waitForSelector(panel.taskSelector, cb);
        },

        getTaskBoard : function(cfg) {
            var Ext = this.Ext();
            var Kanban = this.global.Kanban;

            var resourceStore = new Kanban.data.ResourceStore({

                data : [
                    { Id : 1, Name : 'Mats', ImageUrl : '../resources/images/mats.jpeg' },
                    { Id : 2, Name : 'Homer', ImageUrl : '../resources/images/homer.jpg' },
                    { Id : 3, Name : 'Brian', ImageUrl : '../resources/images/brian.jpeg'},
                    { Id : 4, Name : 'Dave', ImageUrl : '../resources/images/dave.jpg'},
                    { Id : 5, Name : 'Lisa', ImageUrl : '../resources/images/lisa.jpg'},
                    { Id : 6, Name : 'Lee', ImageUrl : '../resources/images/lee.jpg'},
                    { Id : 7, Name : 'Arnold', ImageUrl : '../resources/images/arnold.jpg'},
                    { Id : 8, Name : 'That guy', ImageUrl : '../resources/images/unknown.gif'}
                ]
            })

            var taskStore = new Kanban.data.TaskStore({
                data : [
                    { Id : 1, Name : 'Fix IE7 bug', State : 'NotStarted', ResourceId : 1 },
                    { Id : 2, Name : 'Sneak-install Chrome Frame', State : 'NotStarted', NbrComments : 1, ResourceId : 1},
                    { Id : 3, Name : 'Add Windows Phone support', State : 'InProgress', NbrComments : 1, ResourceId : 3},
                    { Id : 4, Name : 'Make App', State : 'InProgress', NbrComments : 1},
                    { Id : 5, Name : 'Find Unicorn', State : 'Test', ResourceId : 2},
                    { Id : 6, Name : 'IE6 support', State : 'InProgress'},
                    { Id : 7, Name : 'Chrome development', State : 'Done', Attachments : 1},
                    { Id : 8, Name : 'Find holy grail', State : 'Done'},
                    { Id : 9, Name : 'Dig hole', State : 'Done'},
                    { Id : 10, Name : 'Eat raisins', State : 4, NbrComments : 3, Attachments : 2},
                    { Id : 11, Name : 'Do some cool task', State : 4, NbrComments : 3, Attachments : 2},
                    { Id : 12, Name : 'Eat raisins', State : 4, NbrComments : 3, Attachments : 2},
                    { Id : 13, Name : 'Fix hole in the roof', State : 4, NbrComments : 3, Attachments : 2},
                    { Id : 14, Name : 'Change floor tiles', State : 4, NbrComments : 2, Attachments : 2},
                    { Id : 15, Name : 'Uninstall IE', State : 'Done', NbrComments : 67, Attachments : 400, Cls : 'special'}
                ]
            });

            var taskBoard = new Kanban.view.TaskBoard(Ext.apply({
                resourceStore : resourceStore,
                taskStore : taskStore,
                region    : 'center',
                padding   : 10,
                height    : 400,
                width     : 800,
                editor    : new Kanban.editor.SimpleEditor({
                    dataIndex : 'Name'
                }),

                viewConfig : {
                    multiSelect : true,

                    taskToolTpl : '<div class="sch-tool-ct">' +
                        '<div class="sch-tool sch-tool-comment {[ values.NbrComments > 0 ? \"\" : \"x-hidden\"]}">{NbrComments}</div>' +
                        '</div>'
                },

                // Configure each state column individually
                columnConfigs : {
                    "0" : {
                        dockedItems : {
                            xtype   : 'container',
                            dock    : 'bottom',
                            layout  : 'fit',
                            border  : 0,
                            padding : '5 8',
                            style   : 'background:transparent',
                            items   : {
                                height : 30,

                                xtype : 'addnewfield',
                                store : taskStore
                            }
                        }
                    }
                }
            }, cfg));

            return taskBoard;
        }
    }
})
