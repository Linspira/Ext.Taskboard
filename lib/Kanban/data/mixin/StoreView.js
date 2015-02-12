/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Kanban.data.mixin.StoreView', {

    state       : null,
    masterStore : null,

    bindToStore : function (store) {
        this.masterStore = store;

        this.mon(store, {
            add         : this.onMasterAdd,
            clear       : this.onMasterClear,
            remove      : this.onMasterRemove,
            update      : this.onMasterUpdate,
            refresh     : this.onMasterDataChanged,
            scope       : this
        });

        this.copyStoreContent();
    },

    onMasterAdd : function (store, records) {

        for (var i=0; i < records.length; i++) {
            if (records[i].getState() === this.state) {
                this.add(records[i]);
            }
        }
    },

    onMasterClear : function () {
        this.removeAll();
    },

    onMasterUpdate: function (store, record, operation, modifiedFieldNames) {

        if (Ext.Array.indexOf(modifiedFieldNames, 'State') >= 0 && record.getState() === this.state) {
            Ext.Array.each(record.stores, function(s) {
                if (s.masterStore) {
                    s.remove(record);
                    this.add(record);

                    return false;
                }
            }, this);
        }
    },

    onMasterRemove : function (store, rec) {
        if (rec.getState() === this.state) {
            this.remove(rec);
        }
    },

    onMasterDataChanged : function (store) {
        this.copyStoreContent();
    },

    copyStoreContent : function() {
        var state = this.state;

        var records = Ext.Array.filter(this.masterStore.data.items, function(rec) {
            return rec.getState() === state;
        });

        this.loadData(records, false);
    }
});
