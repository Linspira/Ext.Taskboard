StartTest(function(t) {
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    Ext.Loader.setConfig({
        enabled             : true, 
        disableCaching      : false 
    });
    
    var extFolder = t.getExtBundleFolder();

    if (!extFolder) {
        t.fail('Ext JS folder not found');
        return;
    }

    Ext.Loader.setPath('Sch', '../lib/Sch')
    Ext.Loader.setPath('Kanban', '../lib/Kanban')
    Ext.Loader.setPath('Ext', extFolder + '/src')
    Ext.Loader.setPath('Ext.core', extFolder + '/src/core/src')

    t.requireOk([
        'Kanban.view.TaskBoard',
    ], function () {
        // Required as of 4.1.1-rc2
        var as = t.beginAsync();
        Ext.onReady(function() {
            t.endAsync(as);
            t.ok(Kanban.view.TaskBoard, "Kanban.view.TaskBoard is here")

            var panel = t.getTaskBoard();

            panel.render(Ext.getBody());

            t.ok(panel.getEl(), 'Panel grid has been rendered');

            panel.destroy();
        })
    })
})    
