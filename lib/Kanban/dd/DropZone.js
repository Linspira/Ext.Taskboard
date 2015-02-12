/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Kanban.dd.DropZone', {
    extend : 'Ext.dd.DropZone',
    panel  : null,

    getTargetFromEvent : function (e) {
        return e.getTarget();
    },

    // While over a target node, return the default drop allowed class which
    // places a "tick" icon into the drag proxy.
    onNodeOver         : function (target, dd, e, data) {
        var xy          = e.getXY();
        var proxyDom    = dd.proxy.el.dom;
        var allowed     = false;

        proxyDom.style.display = 'none';
        var node = document.elementFromPoint(xy[0] - data.bodyScroll.left, xy[1] - data.bodyScroll.top);

        // IE8 likes it twice, for simulated events..
        if (Ext.isIE8 && e && e.browserEvent.synthetic) {
            node = document.elementFromPoint(xy[0] - data.bodyScroll.left, xy[1] - data.bodyScroll.top);
        }

        proxyDom.style.display = 'block';

        if (!node) {
            return null;
        }

        var view = this.panel;

        if (!node.className.match('sch-taskview')) {
            var parent = Ext.fly(node).up('.sch-taskview');

            if (parent) {
                node = parent.dom;
            } else {
                return this.dropNotAllowed;
            }
        }

        if (node) {
            var state = this.panel.resolveState(node);

            allowed = data.taskRecords[0].isValidTransition(state);
        }

        return allowed ? this.dropAllowed : this.dropNotAllowed;
    },

    notifyDrop : function (dd, e, data) {

        dd.proxy.el.dom.style.display = 'none';
        var xy = e.getXY();
        var node = document.elementFromPoint(xy[0] - data.bodyScroll.left, xy[1] - data.bodyScroll.top);
        var invalid = true;
        var el = data.ddel,
            newState = this.panel.resolveState(node);

        if (newState !== false) {
            var records = data.taskRecords;

            Ext.Array.each(records, function (record) {
                if (record.isValidTransition(newState)) {
                    record.setState(newState);
                    invalid = false;
                }
            });
        }

        if (invalid) {
            dd.proxy.el.dom.style.display = 'block';
            dd.proxy.el.animate({
                duration      : 500,
                easing        : 'ease-out',
                to            : {
                    x : dd.getRepairXY(e, data)[0],
                    y : dd.getRepairXY(e, data)[1]
                },
                stopAnimation : true
            });
            return false;
        }

        this.panel.deselectAll();

        return true;
    }
});