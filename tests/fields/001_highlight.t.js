describe('Views should react correctly to highlighting', function (t) {

    var panel = t.getTaskBoard({
        renderTo  : document.body,
        height    : 200,
        width     : 200,
        taskStore : new Kanban.data.TaskStore({
            data : [
                { Id : 1, Name : 'Foo', Cls : 'task1'},
                { Id : 2, Name : 'Bar', Cls : 'task2'}
            ]
        })
    });

    var field = new Kanban.field.TaskHighlight({
        panel    : panel,
        renderTo : document.body
    })

    t.chain(

        { type : 'F', target : field },

        function (next) {
            t.is(field.minLength, 2);

            t.selectorNotExists('.sch-filter-match', 'Should not filter on 1 characters');
            t.hasNotCls(panel, '.sch-taskboard-filtered', 'Panel el should not have "sch-taskboard-filtered" cls');

            next()
        },

        { type : 'o' },

        function (next) {
            t.selectorExists('.sch-filter-match.task1', 'Should filter on 2 characters');
            t.selectorNotExists('.sch-filter-match.task2', 'Should filter on 2 characters');
            t.hasCls(panel.el, 'sch-taskboard-filtered', 'Panel el should have "sch-taskboard-filtered" cls');

            panel.clearHighlight();

            t.hasNotCls(panel.el, 'sch-taskboard-filtered', 'Panel el should not have "sch-taskboard-filtered" cls after clearHighlight call');
            t.selectorNotExists('.sch-filter-match', 'Should not find "sch-filter-match" cls after clearHighlight call');

            next()
        },

        { type : 'z' },

        function (next) {
            t.selectorNotExists('.sch-filter-match', 'No matches');
            t.hasCls(panel.el, 'sch-taskboard-filtered', 'Panel el should have "sch-taskboard-filtered" cls');

            panel.clearHighlight();

            t.hasNotCls(panel.el, 'sch-taskboard-filtered', 'Panel el should not have "sch-taskboard-filtered" cls after clearHighlight call');
            t.selectorNotExists('.sch-filter-match', 'Should not find "sch-filter-match" cls after clearHighlight call');
        }
    )
})
