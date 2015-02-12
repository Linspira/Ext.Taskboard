/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.view.TaskView
 @extends Ext.view.View

 A task view class used internally by the Kanban Panel, based on the {@link Ext.view.View} class, showing a plain list of {@link Kanban.model.Task tasks}.
 */
Ext.define('Kanban.view.TaskView', {
    extend : 'Ext.view.View',
    alias  : 'widget.taskview',

    requires        : [
        "Ext.XTemplate",
        "Kanban.data.ViewStore"
    ],

    // Inherited configs
    autoScroll      : true,
    trackOver       : true,
    overItemCls     : 'sch-task-over',
    selectedItemCls : 'sch-task-selected',
    itemSelector    : '.sch-task',

    // Class configs & properties
    state           : null,

    /**
     * @cfg {String} taskBodyTpl The template to use for the task body rendering
     */
    taskBodyTpl :
        // TODO should read from Model imageUrlField
        '<tpl if="ImageUrl"><img class="sch-task-img" src="{ImageUrl}"/></tpl>' +                     // TODO should read from Model nameField
        '<span class="sch-task-id">{[ values.id ? "#" + values.id : "" ]}</span><span class="sch-task-name"> {Name}</span>',

    /**
     * @cfg {String} resourceImgTpl The template to use for the user image
     */
    resourceImgTpl : '<img src="{ResourceImageUrl}" class="sch-user-avatar {[values.ResourceImageUrl ? \"\" : \"sch-no-img\"]}" />',

    /**
     * @cfg {String} taskToolTpl The template to use for any tools that should be shown at the bottom of a task box.
     */
    taskToolTpl : '',

    /**
     * A renderer template method intended to be overwritten to supply custom values for the template used to render a task.
     * This is called once every time a task is rendered and two arguments are passed, the task record and a 'renderData' object containing
     * the properties that will be applied to the template. In addition to the prepopulated renderData properties such as task 'Name', 'Id' etc you can also
     * supply a 'cls' (added as a CSS class) property and 'style' (added as inline styles) to programmatically change the appearance of tasks in the list.

     * @param {Kanban.model.Task} task The task record
     * @param {Object} renderData The object that will be applied to the template
     */
    taskRenderer : function(taskRecord, renderData) {},

    initComponent : function () {
        var me = this;

        this.addCls('sch-taskboard-taskview');

        Ext.apply(this, {

            tpl : new Ext.XTemplate(
                '<tpl for=".">',
                    // TODO Should read clsField, stateField from Model
                    '<div class="sch-task sch-task-state-{State} {Cls} {cls} {[values.phantom ? "sch-phantom-task" : ""]}" style="{style}">' +
                        '<div class="sch-task-inner">' +
                            me.taskBodyTpl +
                            me.resourceImgTpl +
                            me.taskToolTpl +
                        '</div>' +
                    '</div>' +
                '</tpl>'
            )
        });

        this.addCls('sch-taskview sch-taskview-state-' + this.state);

        this.callParent(arguments);
    },

    collectData : function(records) {
        var result = this.callParent(arguments);
        var resourceStore = this.store.resourceStore && this.store.resourceStore;

        for (var i = 0; i < result.length; i++) {
            var taskRenderData  = result[i];
            var task            = records[i];
            var user            = resourceStore && resourceStore.getById(taskRenderData.ResourceId);

            taskRenderData.ResourceImageUrl = user && user.getImageUrl();
            taskRenderData.phantom = task.phantom;

            this.taskRenderer(task, taskRenderData);
        }

        return result;
    }
});
