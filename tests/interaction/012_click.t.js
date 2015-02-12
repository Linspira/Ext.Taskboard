describe('Clicking column header should not raise exception', function(t) {

    var sched = t.getTaskBoard({
        renderTo    : document.body
    });

    t.chain(
        { click : '.sch-taskcolumnheader-state-NotStarted'}
    )
})
