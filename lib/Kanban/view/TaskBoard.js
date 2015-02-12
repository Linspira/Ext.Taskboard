/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

@class Kanban.view.TaskBoard
@extends Ext.Panel

 {@img taskboard/images/board.png}

 A panel based on the {@link Ext.Panel} class which allows you to visualize and manage {@link Kanban.model.Task tasks} and you can
 also assign {@link Kanban.model.Resource resources} to these tasks. The panel expects a {@link Kanban.data.TaskStore taskStore} to be provided and can also
 be configured with a {@link Kanban.data.ResourceStore resourceStore}. Based on the array of {@link Kanban.model.Task#states states}, a list of
 {@link Kanban.view.TaskColumn TaskColumns} will be generated. Tasks can be dragged between these state panels, and you can control which state transitions
 are allowed by subclassing the {@link Kanban.model.Task Task} class and overriding the {@link Kanban.model.Task#isValidTransition} method.

 Sample usage below:

    var resourceStore = new Kanban.data.ResourceStore({
        sorters : 'Name',

        data    : [
            { Id : 1, Name : 'Dave' }
        ]
    });

    var taskStore = new Kanban.data.TaskStore({
        sorters : 'Name',
        data    : [
            { Id : 1, Name : 'Dig hole', State : 'NotStarted'}
        ]
    });

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore : taskStore
    });

    var vp = new Ext.Viewport({
        items       : taskBoard,
        layout      : 'fit'
    });

 Additionally, you can control the layout of the columns yourself by providing an array of Columns yourself.

    var taskBoard = new Kanban.view.TaskBoard({
        ...
        columns : [
            {
                state       : 'NotStarted',
                title       : 'Not Started',
                dockedItems : {
                    xtype   : 'container',
                    dock    : 'bottom',
                    layout  : 'fit',
                    ...
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
        ]
    });

 You can of course also subclass this class like you would with any other Ext JS class and provide your own custom behavior.
    Make sure to also study the other classes used by this component, the various store, model and UI classes.
 */
Ext.define('Kanban.view.TaskBoard', {
    extend : 'Ext.Panel',
    alias  : 'widget.taskboard',

    requires : [
        "Kanban.locale.En",
        "Kanban.data.TaskStore",
        "Kanban.data.ResourceStore",
        "Kanban.view.TaskColumn",
        "Kanban.dd.DropZone",
        "Kanban.dd.DragZone",
        "Kanban.editor.SimpleEditor",
        "Kanban.field.AddNew",
        "Kanban.menu.UserMenu"
    ],


    border   : false,
    layout   : { type : 'hbox', align : 'stretch' },
    defaultType : 'taskcolumn',

    // BEGIN PANEL SPECIFIC PROPERTIES
    /**
     * @cfg {Kanban.data.TaskStore} store The store containing the tasks
     * @required
     */
    taskStore     : null,

    /**
     * @cfg {Kanban.data.ResourceStore} store The store containing the resources that can be assigned to tasks.
     */
    resourceStore     : null,

    /**
    * @cfg {Kanban.view.TaskColumn} columnClass The class to use to instantiate the columns making up the task board. You can subclass
    * the default class and provide your own custom functionality by using this config property.
    * */
    columnClass   : 'Kanban.view.TaskColumn',

    /**
     * @cfg {[Kanban.view.TaskColumn]} columns An array of {@link Kanban.view.TaskColumn} objects defining the various states of the tasks
     * in the board.
     * */
    columns       : null,

    /**
     * @cfg {[Object]} columnConfigs An array of objects containing configuration options for the columns which are automatically created based on
     * the possible states defined in the TaskModel. Only relevant when not specifying the {@link columns} config option.
     * in the board.
     * */
    columnConfigs : null,

    /**
     * @cfg {[Object]} columnConfigs An array of objects containing configuration options for the columns which are automatically created based on
     * the possible states defined in the TaskModel. Only relevant when not specifying the {@link columns} config option.
     * in the board.
     * */
    editor        : null,

    /**
     * @cfg {Object} viewConfig A custom config object that will be passed to each underlying {@link Ext.view.View} instance (one inside each state column)
     * */
    viewConfig    : null,
    
    /**
     * @cfg {Boolean} enableUserMenu true to show a menu when clicking the user of a task.
     */
    enableUserMenu  : true,

    /**
     * @cfg {Boolean} readOnly true to not allow editing or moving of tasks.
     * */
    readOnly  : false,

    /**
     * @cfg {Ext.menu.Menu} userMenu A menu used to edit the assigned user for a task
     * */
    userMenu : null,

    /**
     * @cfg {String} zoomLevel The size of the rendered tasks. Can also be controlled on a per-column level, see {@link Kanban.view.Column#zoomLevel}.
     * */
    zoomLevel     : 'large',
    // EOF PANEL SPECIFIC PROPERTIES

    // Private properties
    taskCls        : 'sch-task',
    taskSelector   : '.sch-task',
    isHighlighting : false,
    views          : null,
    kanbanColumns  : null,
    // EOF Private properties

    initComponent : function () {
        var me = this;

        me.defaults = me.defaults || {};

        Ext.applyIf(me.defaults, {
            margin : 12
        });

        this.taskStore.setResourceStore(this.resourceStore);

        this.addCls('sch-taskboard');
        this.addBodyCls('sch-taskboard-body');

        this.items = this.createColumns();

        if (!this.taskStore) {
            throw 'Must define a taskStore for the Panel';
        }

        if (!this.resourceStore) {
            throw 'Must define a resourceStore for the Panel';
        }

        this.bindResourceStore(this.resourceStore, true);

        this.callParent(arguments);

        this.forEachColumn(function(column) {
            column.bindStore(
                new Kanban.data.ViewStore({
                    masterStore : me.taskStore,
                    state       : column.state
                })
            );
        });
    },

    createColumns : function () {
        var me = this;

        if (this.columns) {
            // Decorate provided columns with viewConfig properties

            Ext.Array.each(this.columns, function (panel) {

                // Simple 1-level deep check if using a container to group some Columns
                if (panel.items) {
                    Ext.Array.each(panel.items, function (panel) {
                        Ext.applyIf(panel, {
                            viewConfig : me.viewConfig
                        });
                    });
                } else {
                    Ext.applyIf(panel, {
                        viewConfig : me.viewConfig
                    });
                }
            });

            return this.columns;
        } else {

            var store = this.taskStore;
            var states = store.model.prototype.states;
            var colConfigs = this.columnConfigs || {};

            return Ext.Array.map(states, function (state, index) {
                return Ext.create(me.columnClass, Ext.apply({}, {
                    state      : state,
                    viewConfig : me.viewConfig,
                    zoomLevel  : me.zoomLevel
                }, Ext.apply(colConfigs[state] || {}, colConfigs.all)));
            });
        }
    },

    afterRender : function () {
        var me = this;

        this.callParent(arguments);

        if (!this.readOnly) {
            this.setupDragDrop();
            this.initEditor();

            if (this.enableUserMenu && this.userMenu) {
                this.initUserMenu();
            }
        }

        this.views = this.query('taskview');
        this.kanbanColumns = this.query('taskcolumn');

        Ext.Array.each(this.views, function (view) {
            me.relayEvents(view, [

                /**
                 * @event deselect
                 * Fired after a task record is deselected
                 * @param {Ext.selection.DataViewModel} this
                 * @param  {Kanban.model.Task} record The deselected record
                 */
                    'deselect',

                /**
                 * @event select
                 * Fired after a task record is selected
                 * @param {Ext.selection.DataViewModel} this
                 * @param  {Kanban.model.Task} record The selected record
                 */
                    'select'
            ]);

            view.on({
                itemclick       : me.getTaskListener('taskclick'),
                itemcontextmenu : me.getTaskListener('taskcontextmenu'),
                itemmouseenter  : me.getTaskListener('taskmouseenter'),
                itemmouseleave  : me.getTaskListener('taskmouseleave'),
                itemdblclick    : me.getTaskListener('taskdblclick'),

                scope           : me
            });
        });

        me.addEvents(

            /**
             * @event taskclick
             * Fires when clicking a task
             * @param {Ext.view.View} view The DataView object
             * @param {Kanban.model.Task} task The task model
             * @param {HTMLElement} task The clicked HTMLElement
             * @param {Ext.EventObject} event The event object
             */
            'taskclick',

            /**
             * @event taskdblclick
             * Fires when double clicking a task
             * @param {Ext.view.View} view The DataView object
             * @param {Kanban.model.Task} task The task model
             * @param {HTMLElement} task The clicked HTMLElement
             * @param {Ext.EventObject} event The event object
             */
            'taskdblclick',

            /**
             * @event taskcontextmenu
             * Fires when right clicking a task
             * @param {Ext.view.View} view The DataView object
             * @param {Kanban.model.Task} task The task model
             * @param {HTMLElement} task The clicked HTMLElement
             * @param {Ext.EventObject} event The event object
             */
            'taskcontextmenu',

            /**
             * @event taskmouseenter
             * Fires when the mouse moves over a task.
             * @param {Ext.view.View} view The DataView object
             * @param {Kanban.model.Task} task The task model
             * @param {HTMLElement} task The hovered HTMLElement
             * @param {Ext.EventObject} event The event object
             */
            'taskmouseenter',

            /**
             * @event taskmouseleave
             * Fires when the mouse leaves a task DOM node.
             * @param {Ext.view.View} view The DataView object
             * @param {Kanban.model.Task} task The task model
             * @param {HTMLElement} task The HTMLElement
             * @param {Ext.EventObject} event The event object
             */
            'taskmouseleave'
        );

        this.on('select', this.onSelect, this);
    },

    setupDragDrop : function () {
        var me = this;

        this.dragZone = new Kanban.dd.DragZone(this.id, { panel : this });
        this.dropZone = new Kanban.dd.DropZone(this.id, { panel : this });
    },

    resolveState : function (el) {
        var node        = el.dom ? el.dom : el;
        var columnEl    = node.className.indexOf('sch-taskview') >= 0 ? node : Ext.fly(node).up('.sch-taskview');

        if (columnEl) {
            var match = node.className.match(/state-([^\s]*)/);
            return match && match[1];
        }

        return false;
    },

    setZoomLevel : function(level) {
        this.translateToColumns('setZoomLevel', [level]);
    },

    // Will simply return the zoom level of the first scrum column
    getZoomLevel : function() {
        return this.down('taskcolumn').getZoomLevel();
    },

    initEditor : function () {

        if (this.editor) {
            var me = this;

            if (!this.editor.isComponent) {
                this.editor = Ext.widget(this.editor);
            }

            this.editor.init(this);
        }
    },

    initUserMenu : function () {
        var items = [];
        var me = this;

        this.mon(this.el, {
            click    : this.onUserImgClick,
            delegate : '.sch-user-avatar',
            scope    : this
        });
    },

    onUserImgClick : function (e, t) {
        e.stopEvent();

        this.userMenu.showForTask(this.resolveRecordByNode(t), e.getXY());
    },

    resolveViewByNode : function (node) {
        return this.down('[id=' + Ext.fly(node).up('.sch-taskboard-taskview').id + ']');
    },

    resolveRecordByNode : function (node) {
        var view = this.resolveViewByNode(node);

        return view.getRecord(view.findItemByChild(node));
    },

    onSelect : function (sm) {
        this.forEachView (function(v) {
            v !== sm.view && v.getSelectionModel().deselectAll();
        });
    },

    // record or id
    getElementForTask : function (task) {

        if (!(task instanceof Ext.data.Model)) task = this.taskStore.getById(task);

        var state = task.getState();

        if (state) {
            return Ext.get(this.getViewForState(state).getNode(task));
        }
    },

    getViewForState : function(state) {
        return this.down('taskview[state=' + [state] + ']');
    },

    forEachColumn : function(fn, scope) {
        Ext.Array.each(this.query('taskcolumn'), fn, scope || this);
    },

    forEachView : function(fn, scope) {
        Ext.Array.each(this.views, fn, scope || this);
    },

    translateToViews : function(method, args) {
        Ext.Array.map(this.views, function (view) { return view[method].apply(view, args); });
    },

    translateToColumns : function(method, args) {
        Ext.Array.map(this.kanbanColumns, function (col) { return col[method].apply(col, args); });
    },

    translateToSelectionModels : function(method, args) {
        Ext.Array.map(this.views, function (view) {
            var sm = view.getSelectionModel();

            sm[method].apply(sm, args);
        });
    },

    getSelectedRecords : function() {
        return [].concat.apply([], Ext.Array.map(this.views, function (view) { return view.getSelectionModel().getSelection(); }));
    },

    deselectAll : function() {
        this.translateToSelectionModels('deselectAll');
    },

    onDestroy : function() {
        Ext.destroy(
            this.dragZone,
            this.dropZone,
            this.userMenu
        );
    },

    // private
    getTaskListener: function(eventName) {
        return function (view, record, item, index, event) {
            this.fireEvent(eventName, view, record, item, event);
        };
    },

    /**
     * Highlights tasks in the board based on a callback function.
     * @param {Function} callback A function returning true (to indicate a match) or false
     * @return {Object} The 'this' object to use for the callback. Defaults to the panel instance.
     */
    highlightTasksBy : function(callback, scope) {

        if (!this.isHighlighting) {
            this.el.addCls('sch-taskboard-filtered');
            this.isHighlighting = true;
        }

        // Clear old matches first
        this.el.select('.sch-filter-match').removeCls('sch-filter-match');

        for (var i = 0, l = this.taskStore.getCount(); i < l; i++) {
            var rec     = this.taskStore.getAt(i);

            if (callback.call(scope || this, rec)) {
                var el = this.getElementForTask(rec);

                if (el) {
                    el.addCls('sch-filter-match');
                }
            }
        }
    },

    /**
     * Clears any highlighted tasks.
     */
    clearHighlight : function() {
        this.isHighlighting = false;

        this.el.removeCls('sch-taskboard-filtered');
        this.el.select('.sch-filter-match').removeCls('sch-filter-match');
    },

    /**
     * Refreshes all the task columns manually, which can be useful after performing lots of data operations or changes.
     */
    refresh : function() {
        this.translateToViews('refresh');

        this.fireEvent('refresh', this);
    },

    bindResourceStore : function(store, suppressRefresh) {

        var listeners = {
            update  : this.onResourceStoreUpdate,
            refresh : this.onResourceStoreRefresh,
            remove  : this.onResourceStoreRemove,

            scope   : this
        };

        if (this.resourceStore) {
            this.mun(this.store, listeners);
        }

        if (store) {
            this.mon(store, listeners);

            if (!suppressRefresh) {
                this.refresh();
            }
        }

        this.resourceStore = store;
    },

    onResourceStoreUpdate : function() {
        // can be done cheaper
        this.refresh();
    },

    onResourceStoreRefresh : function() {
        // can be done cheaper
        this.refresh();
    },

    onResourceStoreRemove : function() {
        // can be done cheaper
        this.refresh();
    },

    // Private, should probably reside in a new selection model class
    select : function(records) {
        Ext.Array.each(this.views, function(view) {
            var recordsInView = Ext.Array.filter(records, function(rec) { return view.store.indexOf(rec) >= 0; });

            this.select(recordsInView, false, true);
        });
    },

    // Private, should probably reside in a new selection model class
    deselect : function(records) {
        this.translateToSelectionModels('deselect', records);
    }
}, function() {

    Ext.apply(Kanban, {
        /*PKGVERSION*/VERSION : 0.001
    });

});
