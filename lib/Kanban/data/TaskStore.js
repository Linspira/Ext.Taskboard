/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.data.TaskStore
 @extends Ext.data.Store

 A data store class containing {@link Kanban.model.Task task records}. Sample usage below:

    var taskStore = new Kanban.data.TaskStore({
        sorters : 'Name',
        data    : [
            { Id : 1, Name : 'Dig hole', State : 'NotStarted'}
        ]
    });


 You can of course also subclass this class like you would with any other Ext JS class and provide your own custom behavior.
 */
Ext.define('Kanban.data.TaskStore', {
    extend  : 'Ext.data.Store',
    model   : 'Kanban.model.Task',
    proxy   : 'memory',
    sorters : 'Name',

    setResourceStore : function (store) {
        this.resourceStore = store;
    }
});
