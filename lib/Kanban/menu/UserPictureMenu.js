/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.menu.UserPictureMenu
 @extends Ext.menu.Menu

 A simple menu showing a picture for each user that can be assigned to a task. Intended to be used together with the TaskBoard.
 Sample usage:

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore : taskStore,

        userMenu : new Kanban.menu.UserPictureMenu({
            resourceStore : resourceStore
        }),

        ...
    });
 */
Ext.define('Kanban.menu.UserPictureMenu', {
    extend : 'Ext.menu.Menu',

    alias : 'widget.userpicturemenu',

    requires : [
        'Kanban.menu.UserPicker'
    ],

    cls    : 'sch-userpicturemenu',
    width  : 290,
    height : 200,

    resourceStore   : null,
    hideOnClick : true,
    pickerId    : null,


    initComponent : function () {
        var me = this,
            cfg = Ext.apply({}, me.initialConfig);

        delete cfg.listeners;

        Ext.apply(me, {
            plain         : true,
            showSeparator : false,
            bodyPadding   : 0,
            items         : Ext.applyIf({
                margin : 0,
                id     : me.pickerId,
                store  : this.resourceStore,
                xtype  : 'userpicker'
            }, cfg)
        });

        me.callParent(arguments);

        me.picker = me.down('userpicker');

        me.relayEvents(me.picker, ['select']);

        if (me.hideOnClick) {
            me.on('select', me.onUserSelected, me);
        }
    },

    showForTask : function (task, xy) {
        this.task = task;

        this.showAt(xy);

        var user = task.getResource();

        if (user) {
            this.picker.select(user, false, true);
        }
    },

    onUserSelected : function (picker, user) {
        Ext.menu.Manager.hideAll();

        this.task.setResourceId(user.getId());
    }
});
