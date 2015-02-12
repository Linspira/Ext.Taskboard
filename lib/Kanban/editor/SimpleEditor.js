/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.editor.SimpleEditor
 @extends Ext.Editor

 A textfield editor for the TaskBoard allowing you to edit the name of a task easily. By default, it reacts to the 'taskdblclick' event but you
 can configure this by using the {@link #triggerEvent} config.

 Sample usage below:

    var taskBoard = new Kanban.view.TaskBoard({
         resourceStore : resourceStore,
         taskStore     : taskStore,

         editor        : new Kanban.editor.SimpleEditor({
             dataIndex       : 'Name'
         })
    });

 */
Ext.define('Kanban.editor.SimpleEditor', {
    extend   : 'Ext.Editor',
    alias    : 'widget.kanban_simpleeditor',

    /**
     * @cfg {String} dataIndex The data field in your {@link Kanban.model.Task} that this being editor should be editing.
     */
    dataIndex    : 'Name',

    /**
     * @cfg {String} triggerEvent The event that should trigger the editing to start. Set to null to disable the editor from being activated.
     */
    triggerEvent : 'taskdblclick',

    panel        : null,

    autoSize     : {
        width : 'boundEl' // The width will be determined by the width of the boundEl, the height from the editor (21)
    },

    field : {
        xtype      : 'textfield',
        allowEmpty : false
    },

    selector : '.sch-task-name',

    editRecord : function (record, el) {
        this.record = record;

        el = el || this.panel.getElementForTask(record).down(this.selector);

        if (el) {
            this.startEdit(el);
        }
    },

    initComponent : function () {
        this.on('complete', this.onEditDone, this);

        this.callParent(arguments);
    },

    init : function(panel) {
        this.panel = panel;

        if (this.triggerEvent) {
            panel.on(this.triggerEvent, function (pnl, record, node, e) {
                var t = e.getTarget(this.selector);

                if (t) {
                    this.editRecord(record, t);
                }

            }, this);
        }
    },

    onEditDone : function () {
        this.record.set(this.dataIndex, this.getValue());
    }
});