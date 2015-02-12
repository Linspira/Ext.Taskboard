Ext.data.JsonP.Kanban_menu_UserPictureMenu({"tagname":"class","name":"Kanban.menu.UserPictureMenu","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"UserPictureMenu.js","href":"UserPictureMenu.html#Kanban-menu-UserPictureMenu"}],"extends":"Ext.menu.Menu","aliases":{"widget":["userpicturemenu"]},"alternateClassNames":[],"mixins":[],"requires":["Kanban.menu.UserPicker"],"uses":[],"members":[{"name":"cls","tagname":"property","owner":"Kanban.menu.UserPictureMenu","id":"property-cls","meta":{"private":true}},{"name":"height","tagname":"property","owner":"Kanban.menu.UserPictureMenu","id":"property-height","meta":{"private":true}},{"name":"hideOnClick","tagname":"property","owner":"Kanban.menu.UserPictureMenu","id":"property-hideOnClick","meta":{"private":true}},{"name":"pickerId","tagname":"property","owner":"Kanban.menu.UserPictureMenu","id":"property-pickerId","meta":{"private":true}},{"name":"resourceStore","tagname":"property","owner":"Kanban.menu.UserPictureMenu","id":"property-resourceStore","meta":{"private":true}},{"name":"width","tagname":"property","owner":"Kanban.menu.UserPictureMenu","id":"property-width","meta":{"private":true}},{"name":"initComponent","tagname":"method","owner":"Kanban.menu.UserPictureMenu","id":"method-initComponent","meta":{"private":true}},{"name":"onUserSelected","tagname":"method","owner":"Kanban.menu.UserPictureMenu","id":"method-onUserSelected","meta":{"private":true}},{"name":"showForTask","tagname":"method","owner":"Kanban.menu.UserPictureMenu","id":"method-showForTask","meta":{"private":true}}],"code_type":"ext_define","id":"class-Kanban.menu.UserPictureMenu","short_doc":"A simple menu showing a picture for each user that can be assigned to a task. ...","component":false,"superclasses":["Ext.menu.Menu"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.menu.Menu<div class='subclass '><strong>Kanban.menu.UserPictureMenu</strong></div></div><h4>Requires</h4><div class='dependency'>Kanban.menu.UserPicker</div><h4>Files</h4><div class='dependency'><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu' target='_blank'>UserPictureMenu.js</a></div></pre><div class='doc-contents'><p>A simple menu showing a picture for each user that can be assigned to a task. Intended to be used together with the TaskBoard.\nSample usage:</p>\n\n<p>   var taskBoard = new <a href=\"#!/api/Kanban.view.TaskBoard\" rel=\"Kanban.view.TaskBoard\" class=\"docClass\">Kanban.view.TaskBoard</a>({\n       resourceStore : resourceStore,\n       taskStore : taskStore,</p>\n\n<pre><code>   userMenu : new <a href=\"#!/api/Kanban.menu.UserPictureMenu\" rel=\"Kanban.menu.UserPictureMenu\" class=\"docClass\">Kanban.menu.UserPictureMenu</a>({\n       resourceStore : resourceStore\n   }),\n\n   ...\n</code></pre>\n\n<p>   });</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-cls' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-property-cls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-property-cls' class='name expandable'>cls</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'sch-userpicturemenu'</code></p></div></div></div><div id='property-height' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-property-height' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-property-height' class='name expandable'>height</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>200</code></p></div></div></div><div id='property-hideOnClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-property-hideOnClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-property-hideOnClick' class='name expandable'>hideOnClick</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-pickerId' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-property-pickerId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-property-pickerId' class='name expandable'>pickerId</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-resourceStore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-property-resourceStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-property-resourceStore' class='name expandable'>resourceStore</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-width' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-property-width' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-property-width' class='name expandable'>width</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>290</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-initComponent' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onUserSelected' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-method-onUserSelected' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-method-onUserSelected' class='name expandable'>onUserSelected</a>( <span class='pre'>picker, user</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>picker</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>user</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-showForTask' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Kanban.menu.UserPictureMenu'>Kanban.menu.UserPictureMenu</span><br/><a href='source/UserPictureMenu.html#Kanban-menu-UserPictureMenu-method-showForTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Kanban.menu.UserPictureMenu-method-showForTask' class='name expandable'>showForTask</a>( <span class='pre'>task, xy</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>xy</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});