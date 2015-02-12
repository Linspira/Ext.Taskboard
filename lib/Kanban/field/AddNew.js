/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.field.AddNew
 @extends Ext.form.TextField

 A basic text field that allows you to easily add new tasks by typing a name and hitting the Enter key.
 */
Ext.define('Kanban.field.AddNew', {
    extend            : 'Ext.form.TextField',
    alias             : 'widget.addnewfield',
    enableKeyEvents   : true,
    emptyText         : 'Add new task...',

    /**
     * @cfg {Kanban.data.TaskStore} store The task store
     * @required
     */
    store             : null,

    /**
     * @cfg {Object} defaults Any default properties to be applied to the newly created tasks
     */
    defaults          : null,

    initComponent : function () {
        this.on('keyup', this.onMyKeyUp, this);

        this.callParent(arguments);
    },

    onMyKeyUp : function(field, e) {
        if (e.getKey() === e.ENTER) {
            var vals = {};

            vals[this.store.model.prototype.nameField] = this.getValue();

            this.store.add(Ext.apply(vals, this.defaults));

            this.setValue();
        }
    }
});
