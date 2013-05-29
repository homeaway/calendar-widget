HomeAway Calendar Widget
===========

![Example Calendar](/example/example.png "Example Calendar")

The HomeAway Calendar Widget provides a reusable, easy to setup availability calendar and datepicker. The availability calendar and datepicker use the same calendar plugin, but with different options passed in. The HomeAway Calendar Widget uses Grunt.js to build it's JavaScript and CSS. Be sure that you have Ruby 1.9, <a href="http://compass-style.org/" alt="Compass Style">Compass</a>, <a href="http://gruntjs.com/" alt="Grunt.js">Grunt.js</a>, and <a href="https://npmjs.org/" alt="NPM">NPM</a> (>1.1 version) installed on your machine to before attempting to build project. To build the project run:

```
$ npm install
$ grunt
```

To see an example inline and datepicker calendar run:

```
$ python -m SimpleHTTPServer
```

and navigate to <a href="http://localhost:8000/example" alt="HomeAway Calendar Widget Example URL" target="_blank">http://localhost:8000/example</a>

See LICENSE.txt for license information.

# Dependencies

| Library | Description |
| ------------- |:--------------|
| Backbone.js 0.9.2 | Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface. |
| Lo-Dash.js  0.5.2 | An alternative to Underscore.js, delivering consistency, customization, performance, and extra features. |
| jQuery UI-Core.js 1.7.3 | The core of jQuery UI, required for all interactions and widgets. |
| jQuery UI-Datepicker.js 1.7.3 | Displays a calendar from an input or inline for selecting dates. |

# Usage

```javascript
$('#myCalendar').calendar(options)
```
# Options

name | type | default | description
------------- |:-------------:|:-------------:|:--------------
url | String | ```''``` | The url to fetch data from. The default value is configured for SWIFT so feel free to override this to fit your url structure.
startOfWeek | Number | ```0``` | The day of the week for the calendar to start on. 0 is for Sunday, 1 is for Monday, etc.
language | Object | English US. See below for default. | The language keys to use for the datepicker. To pass in keys use the following format. Note that all keys must be provided if an alternative language is being used. They must also follow the correct ordering of months, days, etc. 
defaultDate | <a href="http://api.jqueryui.com/datepicker/#option-defaultDate" alt="jQuery UI Datepicker Widget Documentation">See Docs</a> | todays date | The date to start the date picker on.
minDate | <a href="http://api.jqueryui.com/datepicker/#option-minDate" alt="jQuery UI Datepicker Widget Documentation">See Docs</a> | ```undefined``` | The minimum date that the calendar can select. This is applied to both start and end calendars.
minDate | <a href="http://api.jqueryui.com/datepicker/#option-maxDate" alt="jQuery UI Datepicker Widget Documentation">See Docs</a> | ```undefined``` | The maximum date that the calendar can select. This is applied to both start and end calendars.
startCalendarDate | Date Object | ```undefined``` | The date to set the start calendar datepicker to.
endCalendarDate | Date Object | ```undefined``` | The date to set the end calendar datepicker to.
showButtonPanel | Boolean | ```false``` | Determines if the datepicker shows the button panel.
startIsEndMinimum | Boolean | ```false``` | Determines if the end calendars minimum date is the selected date of the first calendar.
numberOfMonths | Number or Array | ```1``` or ```[N, M]``` | The number of inline calendars to show. Alternatively an array can be passed in specifying a grid of calendars.
propertyId | String | ```''``` | The property id to fetch data for, given an id is specific to a property.
fetch | boolean | ```true``` | Determines if the calendar should fetch data.
calendar | Object | ```{}``` | An object of default calendar days to add to the calendar. See the JSON schema for details.
reservations | Object | ```{}``` | An object of default reservations that correspond to calendar days. See the JSON schema for details.
clicked | Object | See below for default. | An object whose keys are event statuss and values are callback functions for on click of a particular event. These functions are called on click for a particular day for a given type of event. The functions are passed the jQuery element that was clicked and the calendar reservation object for the day clicked.
hovered | Object | See below for default. | An object whose keys are represent the on and off hover of an event and whose values are callback functions for their corresponding hover events. The functions are passed the jQuery element that was hovered and an array of calendar reservation objects for the day hovered.
error | Function | See below for default. | A function to handle error events from the model. Generally this should be used to control how to display error messages.
endCalendar | String | ```''``` | A jQuery selector string to the second calendar.
hoverClass | String | ```''``` | The class to apply to dates between the selected start and end dates when using two datepickers.
hoverClassStart | String | ```''``` | The class to apply to the selected start date when using two datepickers.
hoverClassEnd | String | ```''``` | The class to apply to the selected end date when using two datepickers.

### Language Default

```javascript
{ 
    closeText: 'Done',
    prevText: 'Prev',
    nextText: 'Next',
    currentText: 'Today',
    monthNames: ['January','February','March','April','May','June',
    'July','August','September','October','November','December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
    weekHeader: 'Wk'
}
```

### Hovered Default

```javascript
{
  'on': function(element, reservations) {
  },
  'off': function(element, reservations) {
  }
}
```

### Clicked Default

```javascript
{
  'inquiry': function(element, reservation) {
  },
  'unavailable': function(element, reservation) {
  },
  'hold': function(element, reservation) {
  },
  'reserve': function(element, reservation) {
  },
  'delete': function(element, reservation) {
  }
}
```

### Error Default

```javascript
function(error) {
} 
```

# Events

The Calendar widget allows users to pass in their own custom functions for on click of statuss, on error, and a custom changed event that is fired for when the start or end dates have changed for input field datepickers.

In addition, the calendar widget publishes events for on click of events and on error that can be easily subscribed to. Therefore, if you have a custom endpoint with custom event statuses you can easily subscribe to the events. Below is an example of subscribing to the on click of a reserve event and the on error event. Note the first parameter, e, is the event object.

```javascript
$('#myCalendar').on('reserve', function(e, element, reservation) {
  console.log('Reserve event triggered!');
  console.log(reservation);
});

$('#myCalendar').on('error', function(e, error) {
  console.log('Error event triggered!');
  console.log(error);
});

$('#myCalendar').on('changed', function(e) {
  console.log('The calendar date was changed!');
});
```

# Expected JSON Schema

If you decide to roll your own endpoint to serve up reservation data, the url that the HomeAway Calendar Widget hits is structured as follows:

```javascript
url + propertyId + '?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD'
```

Where url and propertyId are options that can be passed into the HomeAway Calendar Widget and the start and end dates are automically calculated.

The calendar expects an object returned with a calendar attribute whose value is an object of events or event ranges. An event range contains a start and end date for the event as well as the event status(type of event) and a unique id. Event ranges are particularly useful when initializing the calendar with data, such as an inquiry. The JSON schema that the calendar expects is below.

```javascript
{
  'calendar': {
    'YYYY-MM-DD': {
      'reservationId': '',
      'status': 'RESERVE' | 'HOLD' | 'DELETE' | 'UNAVAILALBE'
    },
    'EXAMPLE': {
      'startDate': 'YYYY-MM-DD',
      'endDate': 'YYYY-MM-DD',
      'reservationId': '',
      'status': 'RESERVE' | 'HOLD' | 'DELETE' | 'UNAVAILALBE'
    }
  },
  'reservations': {
    'reservationId': {
      'guestFirstName': '',
      'guestLastName': '',
      'status': 'RESERVE' | 'HOLD' | 'DELETE' | 'UNAVAILALBE',
      'checkinTime': '',
      'checkoutTime': ''
      'checkinDate': 'YYYY-MM-DD',
      'checkoutDate': 'YYYY-MM-DD'
    }
  }
}
```

A calendar event object, whose key is a date, has the following properties.

name | type | expected value(s) | description
------------- |:-------------:|:-------------:|:--------------
reservationId | String | ```''``` | The unique id of the event.
status | String | ```'RESERVE'``` or ```'HOLD'``` or ```'DELETE'``` or ```'UNAVAILALBE'``` | The status of the event. Currently supported event statuses are the above.

A calendar event range object, whose key is a random value, has the following properties.

name | type | expected value(s) | description
------------- |:-------------:|:-------------:|:--------------
startDate | String | ```'YYYY-MM-DD'``` | The start date of the event.
endDate | String | ```YYYY-MM-DD'``` | The end date of the event.
reservationId | String | ```''``` | The unique id of the event.
status | String | ```'RESERVE'``` or ```'HOLD'``` or ```'DELETE'``` or ```'UNAVAILALBE'``` | The status of the event. Currently supported event statuses are the above.

A reservation object, whose key is a reservationId from a calendar object, has the following properties.

name | type | expected value(s) | description
------------- |:-------------:|:-------------:|:--------------
guestFirstName | String | ```''``` | The guests first name associated with the event.
guestLastName | String | ```''``` | The guests last name associated with the event.
checkinTime | | |
checkoutTime | | |
checkinDate | String | ```YYYY-MM-DD``` | The checkin date for the reservation.
checkoutDate | String | ```YYYY-MM-DD``` | The checkout date for the reservation.
status | String | ```'RESERVE'``` or ```'HOLD'``` or ```'DELETE'``` or ```'UNAVAILALBE'``` | The status of the event. Currently supported event statuses are the above.

Example JSON.

```javascript
{
  'calendar': {
    "range": {
        "startDate": '2013-01-02',
        "endDate": '2013-01-05',
        "reservationId": "inquiry"
    },
    "2013-02-11": {
        "status": "RESERVE",
        "reservationId": "24ba2024-f0dd-4c7d-a744-57396d56fd42"
    },
    "2013-02-12": {
        "status": "RESERVE",
        "reservationId": "24ba2024-f0dd-4c7d-a744-57396d56fd42"
    },
    "2013-02-13": {
        "status": "RESERVE",
        "reservationId": "24ba2024-f0dd-4c7d-a744-57396d56fd42"
    }
  },
  'reservations': {
    "24ba2024-f0dd-4c7d-a744-57396d56fd42": {
        "guestFirstName": "Jane",
        "guestLastName": "Doe",
        "checkinDate": "2013-02-11",
        "checkoutDate": "2013-02-14",
        "checkinTime": "01:30",
        "checkoutTime": "21:00",
        "status": "RESERVE"
    },
    "inquiry": {
        "status": "INQUIRY"
        "guestFirstName": "John",
        "guestLastName": "Doe",
        "checkinDate": "2013-01-02",
        "checkoutDate": "2013-01-05",
        "checkinTime": "02:30",
        "checkoutTime": "6:45",
    }
  }
}
```

# Examples

Include the HomeAway Calendar Widget CSS and JS.

```html
<link href="calendar-widget.min.css" rel="stylesheet">
<script src="calendar-widget.min.js"></script>
```

As with the jQuery UI Datepicker if the datepicker is given a div for it's binding element it will create an inline datepicker. If given an input field as it's binding element it will create a datepicker.

## Availabilty Calendar

Create a div to bind the calendar to.

```html
<div id="myCalendar"></div>
```

Create the calendar.

```javascript
$('#myCalendar').calendar({
  numberOfMonths:     2,
  propertyId:       'c584729e-441a-464a-9f24-2e7cc7294568',
  clicked: {
    reserve: function(element, reservation) {
      console.log("Reserve status event clicked!");
      console.log(reservation);
    },
    hold: function(element, reservation) {
      console.log("Hold status event clicked!");
      console.log(reservation);
    }
  },
  hovered: {
    on: function(element, reservations) {
      console.log("Event hovered on!");
    },
    off: function(element, reservations) {
      console.log("Event hovered off!");
    }
  }
  error: function(error) {
    console.log('There was an error!');
    console.log(error);
  }
});
```

## Datepicker Calendar

Create an input field to bind to.

```html
<input type="text" placeholder="Calendar" class="calendar">
```

Create the calendar.

```javascript
$('.calendar').calendar({
    'fetch': false
});
```

## Datepicker Calendar Using 2 Inputs

Create two input fields to bind to.

```html
<input type="text" placeholder="Start Calendar" class="start-calendar">
<input type="text" placeholder="End Calendar" class="end-calendar">
```

Create the calendars.

Note passing in a jQuery selector for the end calendar and all classes for the highlighting of days in the calendars.

```javascript
$('.start-calendar').calendar({
    'fetch': false,
    'endCalendar': '.end-calendar',
    'hoverClass': 'full-reserve',
    'hoverClassStart': 'pm-reserve',
    'hoverClassEnd': 'am-reserve'
});
```

# Customization

The HomeAway Calendar Widgets colors can be fully customizable by modifying the colors in the _variables.scss file in the sass folder. To recompile the sass into css run:

```
$ npm install
$ grunt
```

# Contribute

The HomeAway Calendar Widget is built with love by <a href="https://www.github.com/pwhisenhunt" alt="Phillip Whisenhunt Github">Phillip Whisenhunt</a>(JavaScript<a href="https://twitter.com/pwhisenhunt" alt="Phillip Whisenhunt Twitter">@pwhisenhunt</a>) and <a href="https://github.com/notethis" alt="Martin Note Github">Martin Note</a>(CSS). Feel free to contribute.
