# Global




**Members:**

+ TrackHelper
+ ComponentsContainer
+ DateService
+ TableEvent
+ EventsManager
+ Controller
+ DataHolder
+ InstanceManager
+ Loader
+ ContentRenderer
+ HtmlParser
+ RenderingStack
+ LayoutRenderer
+ DOMLocator
+ Renderer
+ VisualState
+ PluginBase
+ FilterBase

* * *

### getCellTrack() 

Returns string track ID for cell



### getCellTrackByIndexes() 

Returns string track ID for cell



### getPluginTrack() 

Returns string track ID for plugin



### getPluginTrackByLocation() 

Returns string track ID for plugin



### getHeaderTrack() 

Returns string track ID for header



### getHeaderTrackByColumnName() 

Returns string track ID for header



### getRowTrack() 

Returns string track ID for row



### getRowTrackByIndex() 

Returns string track ID for row



### getCellLocation(e) 

Parses cell track to retrieve column and row index

**Parameters**

**e**: , HTML element containing cell with wrapper

**Returns**: `ICellLocation`, Cell location


### getRowIndex(e) 

Parses row track to retrieve row index

**Parameters**

**e**: , HTML element containing row with wrapper

**Returns**: `number`, Row index


### registerComponent(key, ctor) 

Registers component in components container for further instantiation

**Parameters**

**key**: , Text ID for component

**ctor**: , Constructor function

**Returns**: 


### resolveComponent(key, args) 

Instantiates component by its ID with specified arguments

**Parameters**

**key**: , Text ID of desired component

**args**: , String arguments for instantiation

**Returns**: 


### registerComponentEvents(key, eventsManager) 

Registers component-provided events in particular EventsManager instance.It is important to register all component's events befor instantiation and .init callto make them available to subscribe each other's events.Instance manager asserts that .registerEvent will be called exactly once foreach component used in table

**Parameters**

**key**: , Text ID of desired component

**eventsManager**: , Events manager instance

**Returns**: 


### isValidDate(date) 

Determines is passed object valid Date object

**Parameters**

**date**: , Determines is passed object valid Date object

**Returns**: 


### serialize(date) 

Converts jsDate object to server's understandable format

**Parameters**

**date**: , Date object

**Returns**: `string`, Date in ISO 8601 format


### parse(dateString) 

Parses ISO date string to regular Date object

**Parameters**

**dateString**: , Date string containing date in ISO 8601

**Returns**: 


### getDateFromDatePicker(element) 

Retrieves Date object from 3rd party datepicker exposed by HTML element

**Parameters**

**element**: , HTML element containing datepicker componen

**Returns**: `Date`, Date object or null


### createDatePicker(element) 

Creates datepicker object of HTML element using configured function

**Parameters**

**element**: , HTML element that should be converted to datepicker



### destroyDatePicker(element) 

Creates datepicker object of HTML element using configured function

**Parameters**

**element**: , HTML element that should be converted to datepicker



### putDateToDatePicker(element, date) 

Passes Date object to datepicker element

**Parameters**

**element**: , HTML element containing datepicker componen

**date**: , Date object to supply to datepicker or null



### subscribeCellEvent(subscription) 

Subscribe handler to any DOM event happening on particular table cell

**Parameters**

**subscription**: , Event subscription



### subscribeRowEvent(subscription) 

Subscribe handler to any DOM event happening on particular table row.Note that handler will fire even if particular table cell event happened

**Parameters**

**subscription**: , Event subscription



### invoke(thisArg, eventArgs) 

Invokes event with overridden this arg and specified event args

**Parameters**

**thisArg**: , "this" argument to be substituted to callee

**eventArgs**: , Event args will be passed to callee



### subscribe(handler, subscriber) 

Subscribes specified function to event with supplied string key.Subscriber key is needed to have an ability to unsubscribe from eventand should reflect entity that has been subscriben

**Parameters**

**handler**: , Event handler to subscribe

**subscriber**: , Subscriber key to associate with handler



### unsubscribe(subscriber) 

Unsubscribes specified addressee from event

**Parameters**

**subscriber**: , Subscriber key associated with handler



### registerEvent(eventName) 

Registers new event for events manager.This method is to be used by plugins to provide theirown events.Events being added should be described in plugin's .d.ts fileas extensions to Events manager

**Parameters**

**eventName**: , Event name

**Returns**: 


### reload() 

Initializes full reloading cycle

**Returns**: 


### redrawVisibleDataObject(dataObject, idx) 

Redraws row containing currently visible data object

**Parameters**

**dataObject**: , Data object

**idx**: , Redraws row containing currently visible data object

**Returns**: 


### redrawVisibleData() 

Redraws locally visible data



### produceCell(dataObject, idx, column, row) 

Converts data object,row and column to cell

**Parameters**

**dataObject**: , Data object

**idx**: , Object's displaying index

**column**: , Column that this cell belongs to

**row**: , Row that this cell belongs to

**Returns**: `ICell`, Cell representing data


### produceRow(dataObject, idx, columns) 

Converts data object to display row

**Parameters**

**dataObject**: , Data object

**idx**: , Object's displaying index

**columns**: , Optional displaying columns set

**Returns**: `IRow`, Row representing displayed object


### registerClientFilter(filter) 

Registers client filter

**Parameters**

**filter**: , Client filter



### registerClientOrdering(dataField, comparator) 

Registers new client ordering comparer function

**Parameters**

**dataField**: , Field for which this comparator is applicable

**comparator**: , Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b

**Returns**: 


### storeResponse() 

Parses response from server and turns it to objects array



### filterSet(objects, query) 

Filters supplied data set using client query

**Parameters**

**objects**: , Data set

**query**: , Client query

**Returns**: `Array`, Array of filtered items


### orderSet(objects, query) 

Orders supplied data set using client query

**Parameters**

**objects**: , Data set

**query**: , Client query

**Returns**: `Array`, Array of ordered items


### filterStoredData(query) 

Filter recent data and store it to currently displaying data

**Parameters**

**query**: , Table query

**Returns**: 


### filterStoredDataWithPreviousQuery() 

Filter recent data and store it to currently displaying datausing query that was previously applied to local data



### localLookup(predicate) 

Finds data matching predicate among locally stored data

**Parameters**

**predicate**: , Filtering predicate returning true for required objects

**Returns**: , Array of ILocalLookupResults


### localLookupDisplayedDataObject(index) 

Finds data object among currently displayed and returns ILocalLookupResultcontaining also Loaded-set index of this data object

**Parameters**

**index**: , Index of desired data object among locally displaying data

**Returns**: , ILocalLookupResult


### localLookupStoredDataObject(index) 

Finds data object among currently displayed and returns ILocalLookupResultcontaining also Loaded-set index of this data object

**Parameters**

**index**: , Index of desired data object among locally displaying data

**Returns**: , ILocalLookupResult


### localLookupDisplayedData(index) 

Finds data object among currently displayed and returns ILocalLookupResultcontaining also Loaded-set index of this data object

**Parameters**

**index**: , Index of desired data object among locally displaying data

**Returns**: , ILocalLookupResult


### localLookupStoredData(index) 

Finds data object among recently loaded and returns ILocalLookupResultcontaining also Loaded-set index of this data object

**Parameters**

**index**: , Index of desired data object among locally displaying data

**Returns**: , ILocalLookupResult


### localLookupPrimaryKey(dataObject) 

Finds data object among recently loaded by primary key and returns ILocalLookupResultcontaining also Loaded-set index of this data object

**Parameters**

**dataObject**: , Object to match

**Returns**: , ILocalLookupResult


### getPlugin(pluginId, placement) 

Reteives plugin at specified placement

**Parameters**

**pluginId**: , Plugin ID

**placement**: , Pluign placement

**Returns**: 


### getPlugins(placement) 

Retrieves plugins list at specific placement

**Parameters**

**placement**: , Plugins placement

**Returns**: 


### getColumnFilter(pluginId, placement) 

Reteives plugin at specified placement

**Parameters**

**pluginId**: , Plugin ID

**placement**: , Pluign placement

**Returns**: 


### getColumnNames() 

Retrieves sequential columns names in corresponding order

**Returns**: 


### getUiColumnNames() 

Retrieves sequential columns names in corresponding order

**Returns**: 


### getUiColumns() 

Retreives columns suitable for UI rendering in corresponding order

**Returns**: 


### getColumn(columnName) 

Retrieves column by its raw name

**Parameters**

**columnName**: , Raw column name

**Returns**: 


### registerQueryPartProvider(provider) 

Registers new query part provider to be used while collectingquery data before sending it to server.

**Parameters**

**provider**: , instance implementing IQueryPartProvider interface

**Returns**: 


### requestServer(command, callback, queryModifier, errorCallback) 

Sends specified request to server and lets table handle it.Always use this method to invoke table's server functionality because this methodcorrectly rises all events, handles errors etc

**Parameters**

**command**: , Query command

**callback**: , Callback that will be invoked after data received

**queryModifier**: , Inline query modifier for in-place query modification

**errorCallback**: , Will be called if error occures

**Returns**: 


### backBind(parentElement) 

Applies binding of events left in events queue

**Parameters**

**parentElement**: , Parent element to lookup for event binding attributes

**Returns**: 


### renderBody(rows) 

Renders supplied table rows to string

**Parameters**

**rows**: , Table rows

**Returns**: , String containing HTML of table rows


### cacheColumnRenderingFunction(column, fn) 

Adds/replaces column rendering function for specified column

**Parameters**

**column**: , Column to cache renderer for

**fn**: , Rendering function



### redrawPlugin(plugin) 

Redraws specified plugin refreshing all its graphical state

**Parameters**

**plugin**: , Plugin to redraw

**Returns**: 


### redrawPluginsByPosition(position) 

Redraws specified plugins refreshing all them graphical state (by position)

**Parameters**

**position**: , Plugin position

**Returns**: 


### redrawRow(row) 

Redraws specified row refreshing all its graphical state

**Parameters**

**row**: , Redraws specified row refreshing all its graphical state

**Returns**: 


### appendRow(row) 

Redraws specified row refreshing all its graphical state

**Parameters**

**row**: , Redraws specified row refreshing all its graphical state

**Returns**: 


### destroyRowByIndex(rowDisplayIndex) 

Removes referenced row by its index

**Parameters**

**rowDisplayIndex**: , Removes referenced row by its index

**Returns**: 


### redrawHeader(column) 

Redraws header for specified column

**Parameters**

**column**: , Column which header is to be redrawn



### clear() 

Clears rendering stack

**Returns**: 


### pushContext(ctx) 

Pushes rendering context into stack

**Parameters**

**ctx**: , Pushes rendering context into stack

**Returns**: 


### push(elementType, element, columnName) 

Pushes rendering context into stack

**Parameters**

**elementType**: , What is being rendered

**element**: , Reference to object is being rendered

**columnName**: , Optional column name - for column-contexted rendering objects

**Returns**: 


### popContext() 

Pops rendering context from stack

**Returns**: 


### renderPlugin(plugin) 

Renders specified plugin into string including its wrapper

**Parameters**

**plugin**: , Plugin interface

**Returns**: 


### renderHeader(column) 

Renders specified column's header into string including its wrapper

**Parameters**

**column**: , Column which header is about to be rendered

**Returns**: 


### getCellElement(cell) 

Retrieves cell element by cell object

**Parameters**

**cell**: , Cell element

**Returns**: `HTMLElement`, Element containing cell (with wrapper)


### getCellElementByIndex(cell) 

Retrieves cell element using supplied coordinates

**Parameters**

**cell**: , Cell element

**Returns**: `HTMLElement`, Element containing cell (with wrapper)


### getRowElement(row) 

Retrieves row element (including wrapper)

**Parameters**

**row**: , Row

**Returns**: , HTML element


### getRowElementByIndex(row) 

Retrieves row element (including wrapper) by specified row index

**Parameters**

**row**: , Row

**Returns**: , HTML element


### getColumnCellsElements(column) 

Retrieves data cells for specified column (including wrappers)

**Parameters**

**column**: , Column desired data cells belongs to

**Returns**: , HTML NodeList containing results


### getColumnCellsElementsByColumnIndex(column) 

Retrieves data cells for specified column (including wrappers) by column index

**Parameters**

**column**: , Column desired data cells belongs to

**Returns**: , HTML NodeList containing results


### getRowCellsElements(row) 

Retrieves data cells for whole row (including wrapper)

**Parameters**

**row**: , Row with data cells

**Returns**: , NodeList containing results


### getRowCellsElementsByIndex(row) 

Retrieves data cells for whole row (including wrapper)

**Parameters**

**row**: , Row with data cells

**Returns**: , NodeList containing results


### getHeaderElement(header) 

Retrieves HTML element for column header (including wrapper)

**Parameters**

**header**: , Column header

**Returns**: , HTML element


### getPluginElement(plugin) 

Retrieves HTML element for plugin (including wrapper)

**Parameters**

**plugin**: , Plugin

**Returns**: , HTML element


### getPluginElementsByPositionPart(plugin) 

Retrieves HTML element for plugin (including wrapper)

**Parameters**

**plugin**: , Plugin

**Returns**: , HTML element


### isRow(e) 

Determines if supplied element is table row

**Parameters**

**e**: , Testing element

**Returns**: `boolean`, True when supplied element is row, false otherwise


### isCell(e) 

Determines if supplied element is table cell

**Parameters**

**e**: , Testing element

**Returns**: `boolean`, True when supplied element is cell, false otherwise


### getCachedTemplate(Template) 

Retrieves cached template handlebars function

**Parameters**

**Template**: , Id

**Returns**: , Handlebars function


### layout() 

Perform table layout inside specified root element



### body(rows) 

Clear dynamically loaded table content and replace it with new one

**Parameters**

**rows**: , Set of table rows



### clearBody() 

Removes all dynamically loaded content in table

**Returns**: 


### subscribeStateChange(fn) 

Subscribes specified function to state change events

**Parameters**

**fn**: , Function that will be called when state changes



### changeState(state, states) 

Applies settings for specified state

**Parameters**

**state**: , State id

**states**: , VisualStates collection



### mixinState(state, states) 

Mixins settings for specified state

**Parameters**

**state**: , State id

**states**: , VisualStates collection



### unmixinState(state) 

Unmixins state of current state

**Parameters**

**state**: , State to unmixin

**Returns**: 


### normalState(states) 

Reverts elements back to normal state

**Parameters**

**states**: , VisualStates collection



### reload() 

Reloads table content.This method is left for backward compatibility

**Returns**: 


### fireDomEvent(eventName, element) 

Fires specified DOM event on specified element

**Parameters**

**eventName**: , DOM event id

**element**: , Element is about to dispatch event



### subscribe(e) 

Events subscription method.In derived class here should be subscription to various events

**Parameters**

**e**: , Events manager



### registerAdditionalHelpers(hb) 

In this method you can register any additional Handlebars.js helpers in case of yourtemplates needs ones

**Parameters**

**hb**: , Handlebars instance

**Returns**: 


### defaultRender(e) 

Default render function using TemplateId from plugin configuration

**Parameters**

**e**: , Templates provider

**Returns**: , content string


### itIsClientFilter() 

Call this method inside init and override filterPredicate method to make this filterparticipate in client-side filtering



### getThisOriginalValue() 

Retrieves original value for this particular cell editor

**Returns**: `Any`, Original, unchanged value


### reset() 

Resets editor value to initial settings



### getValue() 

Returns entered editor value

**Returns**: 


### setValue() 

Sets editor value from the outside



### changedHandler() 

Template-bound event raising on changing this editor's value



### commitHandler() 

Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditorCommit leads to validation. Cell editor should be notified



### rejectHandler() 

Event handler for reject (cancel editing) event raised from inside of CellEditorCell editor should be notified



### onAfterRender(e) 

Called when cell editor has been drawn

**Parameters**

**e**: , HTML element where editor is rendered

**Returns**: 


### focus() 

Needed by editor in some cases

**Returns**: 


### showMessage(message) 

Shows table message according to its settings

**Parameters**

**message**: , Message of type ITableMessage

**Returns**: 



* * *










