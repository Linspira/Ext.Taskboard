/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.data.ResourceStore
 @extends Ext.data.Store

 A data store class containing {@link Kanban.model.Resource user records}. Sample usage below:

 var resourceStore = new Kanban.data.ResourceStore({
        sorters : 'Name',

        data    : [
            { Id : 1, Name : 'Dave' }
        ]
    });


 You can of course also subclass this class like you would with any other Ext JS class and provide your own custom behavior.
 */
Ext.define('Kanban.data.ResourceStore', {
    extend  : 'Ext.data.Store',
    model   : 'Kanban.model.Resource',
    sorters : 'Name',
    proxy   : 'memory'
});
