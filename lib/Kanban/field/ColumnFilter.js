/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.field.ColumnFilter
 @extends Ext.form.TextField

 A text field that allows you to filter out undesired columns from the TaskBoard view.
 */

Ext.define('Kanban.field.ColumnFilter', {
    extend : 'Ext.form.ComboBox',
    alias  : 'widget.columnfilter',

    requires : [
        'Ext.data.JsonStore'
    ],

    multiSelect  : true,
    valueField   : 'id',
    displayField : 'name',
    panel        : null,
    listConfig   : {
        cls : 'sch-columnfilter-list'
    },

    initComponent : function () {
        this.store = new Ext.data.JsonStore({
            proxy  : 'memory',
            fields : ['id', 'name'],
            data   : Ext.Array.map(this.panel.taskStore.model.prototype.states, function (state) {
                return {
                    id   : state,
                    name : Kanban.locale.En[state]
                };
            })
        });

        this.callParent(arguments);

        this.getPicker().on({
            beforeshow      : this.onMyBeforeExpand,
            scope           : this
        });

        this.getPicker().on({
            show            : function(picker) {
                picker.on('selectionchange', this.onMySelect, this);
            },

            hide            : function(picker) {
                picker.un('selectionchange', this.onMySelect, this);
            },

            delay           : 50,  // The picker fires 'selectionchange' as it shows itself
            scope           : this
        });

    },

    onMySelect : function (cmb, selected) {

        this.store.each(function(rec) {
            this.panel.down('[state=' + rec.get('id') + ']')[Ext.Array.indexOf(selected, rec) >= 0 ? 'show' : 'hide']();
        }, this);
    },

    onMyBeforeExpand : function () {
        var panel = this.panel;
        var me = this;
        var visible = [];

        Ext.each(panel.query('taskcolumn'), function (column) {
            if (column.isVisible()) {
                visible.push(me.store.getById(column.state));
            }
        });

        me.select(visible);
    }

});
