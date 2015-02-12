/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.field.TaskFilter
 @extends Ext.form.TextField

 A text field that allows you to filter for tasks by Name in the TaskBoard view. You can filter for another field by setting the {@link #field} config.
 */
Ext.define('Kanban.field.TaskFilter', {
    extend          : 'Ext.form.TextField',
    alias           : 'widget.filterfield',
    enableKeyEvents : true,
    height          : 26,
    minLength       : 2,

    /**
     * @cfg {Kanban.data.TaskStore} store The store containing the tasks
     * @required
     */
    store           : null,

    /**
     * @cfg {String} field The {@link Kanban.model.Task} field that should be used for filtering.
     */
    field           : 'Name',

    /**
     * @cfg {Boolean} caseSensitive True to use case sensitive filtering
     */
    caseSensitive     : false,

    initComponent : function () {
        this.on('keyup', this.onMyKeyUp, this);

        this.callParent(arguments);
    },

    onMyKeyUp : function (field, e) {
        var val = this.getValue();

        if (val && val.length >= this.minLength) {
            this.store.clearFilter(true);

            this.store.filter({
                property      : this.field,
                value         : val,
                caseSensitive : this.caseSensitive,
                anyMatch      : true
            });
        } else {
            this.store.clearFilter();
        }
    }
});
