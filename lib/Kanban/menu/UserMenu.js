/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**

 @class Kanban.menu.UserMenu
 @extends Ext.menu.Menu

 A simple menu showing a list of users that can be assigned to a task. Intended to be used together with the TaskBoard.
 Sample usage:

 var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore : taskStore,

        userMenu : new Kanban.menu.UserMenu({
            resourceStore : resourceStore
        }),

        ...
    });
 */
Ext.define('Kanban.menu.UserMenu', {
    extend    : 'Ext.menu.Menu',

    cls       : 'sch-usermenu',
    /**
     * @cfg {Kanban.data.ResourceStore} store The task store
     * @required
     */
    resourceStore : null,

    initComponent : function () {
        var me      = this;

        Ext.apply(this, {

            renderTo : document.body,

            listeners : {
                beforeshow : function () {
                    var userId = this.task.data.ResourceId;

                    this.items.each(function (item) {
                        if (userId == item.userId) {
                            item.addCls('sch-user-selected');
                        }
                        else {
                            item.removeCls('sch-user-selected');
                        }
                    });
                }
            }
        });

        this.mon(this.resourceStore, {
            load    : this.populate,
            add     : this.populate,
            remove  : this.populate,
            update  : this.populate,

            scope   : this
        });

        this.callParent(arguments);

        this.populate();
    },

    showForTask : function (task, xy) {
        this.task = task;

        this.showAt(xy);
    },

    onUserSelected : function (item) {
        this.task.setResourceId(item.userId);
    },

    populate : function () {
        var me      = this;
        var items   = [];

        this.resourceStore.each(function (user) {
            items.push({
                text    : user.getName(),
                userId  : user.getId(),
                handler : me.onUserSelected,
                iconCls : '_',
                scope   : me
            });
        });

        this.removeAll(true);

        this.add(items);
    }
});
