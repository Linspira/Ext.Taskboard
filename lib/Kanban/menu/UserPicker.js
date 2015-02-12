/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Kanban.menu.UserPicker', {
    extend : 'Ext.view.View',

    alias           : 'widget.userpicker',
    cls             : 'sch-userpicture-view',
    autoScroll      : true,
    showName        : true,
    padding         : '10 5 5 5',

    itemSelector    : '.sch-user',
    overItemCls     : 'sch-user-hover',
    selectedItemCls : 'sch-user-selected',

    initComponent : function () {

        Ext.apply(this, {
            itemTpl : '<tpl for=".">' +
                '<div class="sch-user">' +
                '<img src="{ImageUrl}" />' +
                (this.showName ? '<span>{Name}</span>' : '') +
                '</div>' +
                '</tpl>'
        })
        this.callParent(arguments);
    }



});
