/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.model.Task
 @extends Sch.model.Event

 A data model class describing a task in your Kanban board. You can assign it to a resource using the {@link #assign} method or by
 setting the 'ResourceId' property directly in the data (using {@link #setResourceId} or {@link setResource}).

 You can of course also subclass this class like you would with any other Ext JS class and add your own custom fields.

    Ext.define('MyTask', {
        extend : 'Kanban.model.Task',

        fields : [
            { name : 'NbrComments', type : 'int' },
            { name : 'Attachments', type : 'int' }
        ],

        // Define the states your tasks can be in
        states            : [
            'NotStarted',
            'InProgress',
            'Test',
            'Acceptance',
            'Done'
        ],

        // Here you can control which state transitions are allowed
        isValidTransition : function (state) {
            return true;
        }
    })
 */
Ext.define('Kanban.model.Task', {
    extend      : 'Sch.model.Event',

    resourceStore   : null,

    /**
     * @cfg {[String]} states The names of the possible states that a task can be in. Default states are ["NotStarted", "InProgress", "Test", "Done"].
     */
    states      : [
        'NotStarted',
        'InProgress',
        'Test',
        'Done'
    ],

    customizableFields      : [
        { name : 'State', defaultValue : 'NotStarted' },
        { name : 'CreatedDate', type : 'date' },
        { name : 'ImageUrl' }
    ],

    /**
     * @cfg {String} stateField The name of the field that defines the task state. Defaults to "State".
     */
    stateField  : 'State',

    /**
     * @cfg {String} imageUrlField The name of the field that defines the task image url. Defaults to "ImageUrl".
     */
    imageUrlField  : 'ImageUrl',

    /**
     * @cfg {String} createdDateField The name of the field that defines the task state. Defaults to "CreatedDate".
     */
    createdDateField  : 'CreatedDate',

    /**
     * Returns the associated user of this task.
     *
     * @return {Kanban.model.Resource} The user, if the task has been assigned one.
     */

    /**
     * Returns the associated user store of this task.
     *
     * @return {Kanban.data.ResourceStore} The user store
     */
    getResourceStore : function() {
        if (!this.resourceStore) {
            Ext.Array.each(this.stores, function(store) {
                if (store.resourceStore) {
                    this.resourceStore = store.resourceStore;

                    return false;
                }
            }, this);
        }

        return this.resourceStore;
    },

    /**
     * @method isValidTransition
     *
     * Override this method to define how tasks can be assigned different states based on its current state. If you want to allow all,
     * simply create a method which returns true always.
     *
     * @param {String} toState The new state of this task
     * @return {Boolean} true if valid
     */
    isValidTransition : function (toState) {

        switch (this.getState()) {
            case "NotStarted":
                return toState == "InProgress";
            case "InProgress":
                return toState != "Done";
            case "Test":
                return toState != "NotStarted";
            case "Done":
                return toState == "Test" || toState == "InProgress";

            default:
                return true;
        }
    }
});