/*
 * FOR THE TESTS TO WORK, YOU NEED TO HAVE YOUR EXT JS SDK FOLDER ON THE SAME LEVEL AS THE KANBAN FOLDER
 */

var Harness = Siesta.Harness.Browser.ExtJS;
//var debug = typeof Ext !== "undefined";  // Use debug versions when a browser harness is present
var debug = true;
var extRoot = Harness.getQueryParam('extroot');
var isSmokeTest = Harness.getQueryParam('smoke');

var targetExtVersions;

// Using external Ext copy
if (extRoot) {
    // strip any trailing slashes
    extRoot = extRoot.replace(/\/$/, '');
    targetExtVersions = ['external'];
} else {
    targetExtVersions = [
        '4.2.2'
    ];
}

if (isSmokeTest) {
    // Only run smoke tests against latest version
    targetExtVersions = [targetExtVersions[targetExtVersions.length-1]]
}

Harness.configure({
    title                 : 'Kanban Test Suite',

    testClass             : Bryntum.Test,
    allowExtVersionChange : false,
    disableCaching        : false,
    autoCheckGlobals      : true,
    keepResults           : false,
    overrideSetTimeout    : true,
    enableCodeCoverage    : !isSmokeTest && Boolean(window.IstanbulCollector),
    cachePreload          : isSmokeTest,
    expectedGlobals       : [
        'Sch',
        'Kanban'
    ],
    failKnownBugIn        : Harness.getQueryParam('failKnownBugIn')
});

var topItems = [];

function getTestSuite(extRoot, version) {

    var suite = [
        {
            group           : 'Sanity',
            items           : [
                'sanity/010_sanity.t.js',
                'sanity/015_subclass.t.js',
                'sanity/016_dom_footprint.t.js'
            ]
        },
        {
            group           : 'Sanity slow',
            items           : [
                'sanity/012_no_overrides.t.js',
                {
                    url     : 'sanity/011_on_demand.t.js',
                    preload : [ extRoot + "/ext-debug.js" ]
                },
                {
                    url     : 'sanity/018_on_demand_full.t.js',
                    preload : [ extRoot + "/ext-dev.js" ]
                },
                {
                    url         : 'sanity/013_lint.t.js',
                    alsoPreload : [ "sanity/jshint.js" ]
                },
                {
                    url     : 'sanity/019_unscoped_css_rules.t.js',
                    preload : [
                        '../resources/css/taskboard-all.css',
                        extRoot + '/ext-all.js'
                    ]
                },
                {
                    alsoPreload : ["sanity/symbols.js"],
                    url         : 'sanity/017_private_method_overrides.t.js'
                }
            ]
        },
        {
            group           : 'Data',
            items           : [
                'data/010_task_model.t.js',
                'data/011_task_store.t.js'
            ]
        },
        {
            group           : 'API',
            items           : [
                'api/001_panel.t.js',
                'api/002_column.t.js'
            ]
        },
        {
            group           : 'Interaction',
            items           : [
                'interaction/010_drag_drop.t.js',
                'interaction/011_store_view_integration.t.js',
                'interaction/012_click.t.js'
            ]
        },

        {
            group           : 'Fields',
            items           : [
                'fields/001_highlight.t.js'
            ]
        },

        {
            group           : 'View',
            items           : [
                'view/100_view_refresh_triggers.js'
            ]
        }
    ];

    // Append version number, test url currently has to be unique
    var appendVersion = function (items, version) {
        for (var i = 0; i < items.length; i++) {
            var url = items[i];

            if (url) {
                if (typeof url === 'string') {
                    items[i] += (url.match(/\?/) ? '&' : '?Ext=') + version;
                } else if (url.url) {
                    url.url += (url.url.match(/\?/) ? '&' : '?Ext=') + version;
                } else if (url.items) {
                    appendVersion(url.items, version);
                }
            }
        }
    };

    appendVersion(suite, version);

    return suite;
}


// Add one top group per supported Ext JS version
for (var i = 0; i < targetExtVersions.length; i++) {
    var version = targetExtVersions[i];
    var root = extRoot || '../../extjs-' + version;

    topItems.push({
        group    : extRoot ? extRoot : ('Ext JS ' + version),

        // Only expand latest supported version
        expanded : i === targetExtVersions.length - 1,

        preload : [
            // For local debugging, ext-all-debug.js is optimal
            // For nightly test runs, we use ext-all.js which is faster
            // For nightly test runs in Webkit browsers we use ext-all-dev.js which outputs more warnings and error messages (will be slower)
            root + '/ext-all-dev.js',
            root + '/resources/css/ext-all.css',

            {
                url         : '../taskboard-all' + (debug ? '-debug' : '') + '.js',
                instrument  : true
            },
            '../resources/css/taskboard-all.css'
        ],

        items : getTestSuite(root, version)
    });
}

if (!extRoot && !isSmokeTest) {
    // Inject tests exercising the examples
    var exampleUrls =
            [
                'basic/',
                'advanced/',
                'configurations/',
                'stresstest/'
            ],
        exampleItems = [];

    for (var i = 0; i < exampleUrls.length; i++) {
        if (exampleUrls[i]) {
            exampleItems.push({
                hostPageUrl : '../examples/' + exampleUrls[i],
                url         : 'sdk_examples/10000_sanity.t.js?' + exampleUrls[i],
                name        : '[' + i + '] ' + exampleUrls[i]
            });
        }
    }

    topItems.push(
        {
            group : 'SDK Examples',

            expanded           : false,
            autoCheckGlobals   : false,
            overrideSetTimeout : false,

            items   : exampleItems
        }
    );
}

if (isSmokeTest) {

    topItems[0].items = topItems[0].items.filter(function(group) {
        return group.group in {
            'Sanity'            : 1,
            'Data'              : 1
        }
    });

    topItems[0].items.push({
        url : 'run-smoketests.t.js'
    })
}

Harness.start.apply(Harness, topItems);
