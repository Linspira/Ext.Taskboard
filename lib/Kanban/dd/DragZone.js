/*

Kanban TaskBoard 0.001
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Kanban.dd.DragZone', {
    extend : 'Ext.dd.DragZone',
    panel  : null,

    requires : [

        // a missing require of Ext.dd.DragDrop:
        // http://www.sencha.com/forum/showthread.php?276603-4.2.1-Ext.dd.DragDrop-missing-Ext.util.Point-in-dependency-quot-requires-quot
        'Ext.util.Point'
    ],

    repairHighlight      : false,
    repairHighlightColor : 'transparent',
    containerScroll      : false,

    // @OVERRIDE
    autoOffset           : function (x, y) {
        this.setDelta(0, 0);
    },

    setVisibilityForSourceEvents : function (show) {
        Ext.each(this.dragData.taskEls, function (el) {
            el[ show ? 'show' : 'hide' ]();
        });
    },

    constructor : function () {
        this.callParent(arguments);

        this.proxy.el.child('.x-dd-drag-ghost').removeCls('x-dd-drag-ghost');

        this.proxy.addCls('sch-task-dd');
    },

    getDragData : function (e) {
        var panel = this.panel,
            t = e.getTarget(panel.taskSelector);

        if (!t) return;

        var task = panel.resolveRecordByNode(t);

        // there will be no event record when trying to drag the drag creator proxy for example
        if (!task  /*||eventRecord.isDraggable() === false */ || panel.fireEvent('beforetaskdrag', panel, task, e) === false) {
            return null;
        }

        var xy = e.getXY(),
            taskEl = Ext.get(t),
            taskXY = taskEl.getXY(),
            offsets = [ xy[0] - taskXY[0], xy[1] - taskXY[1] ],
            eventRegion = taskEl.getRegion();

        var relatedRecords = this.getRelatedRecords(task),
            taskEls = [ taskEl ];

        // Collect additional elements to drag
        Ext.Array.each(relatedRecords, function (r) {
            var el = panel.getElementForTask(r);

            if (el) taskEls.push(el);
        });

        var dragData = {
            offsets             : offsets,
            repairXY            : e.getXY(),
            taskEls             : taskEls,
            bodyScroll          : Ext.getBody().getScroll(),
            taskRecords        : [ task ].concat(relatedRecords)
        };

        dragData.ddel = this.getDragElement(taskEl, dragData);

        // To keep the look and size of the elements in the drag proxy
        this.proxy.el.set({
            size  : this.panel.getZoomLevel()
        });

        return dragData;
    },

    onStartDrag : function (x, y) {
        var panel = this.panel,
            dd = this.dragData;

        panel.fireEvent('taskdragstart', panel, dd.taskRecords);
    },


    /**
     * Provide your custom implementation of this to allow additional event records to be dragged together with the original one.
     * @param {Kanban.model.Event} eventRecord The eventRecord about to be dragged
     * @return {Kanban.model.Event[]} An array of event records to drag together with the original event
     */
    getRelatedRecords : function (sourceEventRecord) {

        var panel = this.panel;
        var selected = panel.getSelectedRecords();
        var result = [];

        Ext.each(selected, function (rec) {
            if (rec !== sourceEventRecord /* && rec.isDraggable() !== false */) {
                result.push(rec);
            }
        });

        return result;
    },

    /**
     * This function should return a DOM node representing the markup to be dragged. By default it just returns the selected element(s) that are to be dragged.
     * If dragging multiple events, the clone of the original item should be assigned the special id 'sch-id-dd-ref'
     * @param {Ext.Element} sourceEl The event element that is the source drag element
     * @param {Object} dragData The drag drop context object
     * @return {HTMLElement} The DOM node to drag
     */
    getDragElement : function (sourceEl, dragData) {
        var taskEls = dragData.taskEls;
        var copy;
        var offsetX = dragData.offsets[ 0 ];
        var offsetY = dragData.offsets[ 1 ];
        var sourceHeight = sourceEl.getHeight();

        if (taskEls.length > 1) {
            var ctEl = Ext.core.DomHelper.createDom({
                tag   : 'div',
                cls   : 'sch-dd-wrap',
                style : { overflow : 'visible' }
            });

            Ext.Array.each(taskEls, function (el, i) {
                copy = el.dom.cloneNode(true);

                copy.id = el.dom === sourceEl.dom ? "sch-id-dd-ref" : Ext.id();

                copy.className += i === 0 ? ' sch-dd-source' : ' sch-dd-extra';

                ctEl.appendChild(copy);

                // Adjust each element offset to the source event element
                Ext.fly(copy).setStyle({
                    left   : -offsetX + (i > 0 ? 10 : 0) + 'px',
                    top    : (i === 0 ? 0 : (sourceHeight - 30 + i * 20)) + 'px',
                    width  : el.getWidth() + 'px',
                    height : el.getHeight() + 'px'
                });
            });

            return ctEl;
        } else {
            copy = sourceEl.dom.cloneNode(true);

            copy.id = "sch-id-dd-ref";
            copy.style.left = -offsetX + 'px';
            copy.style.top = -offsetY + 'px';
            copy.style.width = sourceEl.getWidth() + 'px';
            copy.style.height = sourceEl.getHeight() + 'px';

            return copy;
        }
    },

    getRepairXY : function(e, data) {
        return data.repairXY;
    },

    afterRepair: function() {
        this.dragging = false;
    }
});