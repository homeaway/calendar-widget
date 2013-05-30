/* Copyright (c) 2010 HomeAway, Inc.
* All rights reserved.  http://homeaway.github.io/calendar-widget/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */
(function () {
    var $        = window.jQuery;
    var Backbone = window.Backbone;
    var _        = window._;

    var Calendar = function(options) {
        /*
        * @class Calendar
        *
        * @author Phillip Whisenhunt
        * @contructs Calendar object
        *
        * The Calendar creates a custom jquery ui datepicker that uses Backbone.js for storing/retrieving data and
        * for rendering out the calendar. The calendar accepts the following properties as part of the options object:
        *
        * @param {Number | Array} numberOfMonths The number of calendars to render.
        * @param {boolean} fetch A boolean determining if the model should fetch data.
        * @oaram {String} propertyId A property id to fetch data for.
        * @param {String} el A CSS selector to bind the datepickers to.
        * @param {String} url A URL to hit instead of the default endpoint.
        * @param {Date | Number | String} defaultDate A date in the form of 'YYYY-MM-DD' to start the datepicker on.
        * @param {Number} startOfWeek The day of the week for the calendar to start on. 0 is for Sunday, 1 is for Monday, etc.
        * @param {Object} language The language keys to use for the datepicker. To pass in keys use the following format. 
        *               Note that all keys must be provided if an alternative language is being used. They must also follow 
        *               the correct ordering of months, days, etc. See below for an example.
        * @param {Object} clicked An Object whos keys are event statuses and values are functions that accept
        *                a reservations object. These functions are called on click of each type of event.
        * @param {Object} hovered An object whose keys are represent the on and off hover of an event and whose values
        *               are callback functions for their corresponding hover events. These callback functions are passed
        *               the jQuery element that was hovered along with an array of event objects corresponding to the
        *               element hovered.
        * @param {Function} error A function to handle error events from the model. Generally this should
        *               be used control how to display error messages.
        * @param {Object} calendar An array of default calendar day and day ranges.
        * @param {Object} reservations An object of calendar events that contain specific information for a given
        *               calendar day based on a reservation id.
        * @param {Date | Number | String} minDate The minimum date that can a datepicker can select
        * @param {Date | Number | String} maxDate The maximum date that can a datepicker can select
        * @param {Date} startCalendarDate The date to set the start calendar to
        * @param {Date} endCalendarDate The date to set the end calendar to
        * @param {Boolean} startIsEndMinimum Determines if the end calendars minimum date is the selected date of the first calendar
        * @param {Boolean} showButtonPanel Determines if the datepicker shows the button panel
        *
        * @return {Object} Calendar Calendar object constructor

            Example:

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
                },
                calendar: {
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
                reservations: {
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
                },
                language: {
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
            });
        */
    
        this.Model = Backbone.Model.extend(/** @lends CalendarObject.prototype */{
            /** @class CalendarObject
            * @author Phillip Whisenhunt
            * @augments Backbone.Model
            * @requires jQuery
            * @requires Backbone.js
            * @requires Underscore.js
            * @contructs CalendarObject object
            *
            * @param {map} default Default model attributes to pass in.
            * @param {map} options Extra options to pass into the model. */
            initialize: function(attributes, options) {
                // Calculate the start dates and append the inquiry dates to the calendar.
                 var defaultDate = this.get('defaultDate');
                 var calendar    = $.extend(true, [], this.get("calendar"));
                 
                _.bindAll(this, 'formatDate', 'getDefaultDates', 'copyDate', 'makeDate', 'resolveDates', 'setDataBounds', 'reverseFormatDate', 'getReservationsById');

                calendar = $.merge(calendar, this.getDefaultDates());
                this.set('calendar', calendar);

                // If the user didn't pass in a default date then set the date to the current date else create the start and end date ranges from the default date
                !defaultDate ? this.setDataBounds(new Date()) : this.setDataBounds(this.reverseFormatDate(defaultDate));
            },

            /** returns a copy of a date object
             * @param {Date} date The date to be copied.
             * @return {Date} the copied date. */
            copyDate: function(date) {
                return new Date(date.getTime());
            },

            /** makes a copy of a date object from a passed in date and manipulates its months and days based on options passed in.  if a 
             * date isn't passed in then the date falls back to the current date.
             * @param {Date} date The date to be created and manipulated.
             * @param {Date} date An options hash that can include months and days.
             * @return {Date} the manipulated date. */
            makeDate: function(date, options) {
                date = date ? this.copyDate(date): new Date();

                if(options && options.months) {
                    date.setMonth(date.getMonth() + options.months);
                }

                if(options && options.days) {
                    date.setDate(date.getDate() + options.days);
                }
                return date;
            },

            /** sets the bounds of data to fetch based on a date.
             * @param {Date} date The date to se the bounds of data for.
             * @return {boolean} bool JSON response from the server. */
            setDataBounds: function(date) {
                this.set({
                    'endDate': this.formatDate(this.makeDate(date, { months: 12 })),
                    'startDate': this.formatDate(this.makeDate(date, { months: -12 })),
                    'defaultDate': this.formatDate(date)
                });
                return false;
            },

            defaults: {
                // Array of calendar days.
                calendar: [
                ],
                startCalendarDate: undefined,
                endCalendarDate: undefined
            },

            /** Intercepts the returned JSON response and appends the inquiry dates to it.
             * @return {Object} response JSON response from the server. */
            parse: function(response) {
                // resolve the calendar date ranges
                response.calendar = this.resolveDates(response.calendar, response.reservations);
                // add the default dates to the calendar
                response.calendar = $.merge(this.getDefaultDates(), response.calendar);
                return response;
            },

            /** Resolves an object of calendar data containing days and day ranges to
             * to an array of purely calendar days without ranges. It also resolves each calendar
             * day to its correct calendar event object based on reservation id and extends each day
             * object to include the calendar event information.
             *
             * @param {Object} calendarData An array of calendar event objects and event ranges.
             * @param {Object} calendarEvents An object of calendar event objects that contain specific information
             * for a given calendar event. It's keys are ids.
             * @return {Array} dates An array of calendar event objects. */
            resolveDates: function(calendarData, calendarEvents) {
                var dates = [];
                var key, calendarEvent, i, j;

                // Resolves a calendar date and a calendar event to a single object
                function resolveDateAndEvent(calendarDate, calendarEvent) {
                    return  {
                        "startDate": calendarEvent ? calendarEvent.startDate: undefined,
                        "endDate": calendarEvent ? calendarEvent.endDate: undefined,
                        "date": calendarDate.date,
                        "reservationId": calendarDate.reservationId,
                        /* If the user has passed in a duration use that one, else check if the day falls into a
                        checkin or checkout date, else set the duration full. */
                        "duration": (calendarDate.duration ? calendarDate.duration: undefined) || (calendarEvent.checkinDate === calendarDate.date ? 'pm': undefined) || (calendarEvent.checkoutDate === calendarDate.date ? 'am': 'full'),
                        "status":  (calendarEvent ? (calendarEvent.status ? calendarEvent.status.toLowerCase() : ''): ''),
                        "guestFirstName": (calendarEvent ? calendarEvent.guestFirstName: undefined),
                        "guestLastName": (calendarEvent ? calendarEvent.guestLastName: undefined),
                        "checkinTime": (calendarEvent ? calendarEvent.checkinTime: undefined),
                        "checkoutTime": (calendarEvent ? calendarEvent.checkoutTime: undefined)
                    };
                }

                for(key in calendarData) {
                    // Grab the specific calendar event associated with the calendar.
                    calendarEvent = (calendarEvents ? calendarEvents[calendarData[key].reservationId] : undefined);

                    // If the user has specified date ranges calculate the dates between the range
                    if(calendarData[key].startDate && calendarData[key].endDate) {
                        var endDate = calendarData[key].endDate;
                        var startDate = calendarData[key].startDate;
                        var inquiryEndDate   = this.makeDate(this.reverseFormatDate(endDate));
                        var inquiryStartDate = this.makeDate(this.reverseFormatDate(startDate));
                        var reservationId    = calendarData[key].reservationId
                        var currentDate      = inquiryStartDate;
                        var numberOfDaysBetween;
                        
                        // Append the inquiry start date to the calendar as a pm inquiry day
                        dates.push(resolveDateAndEvent({
                            'date': startDate,
                            'duration': 'pm',
                            'reservationId': reservationId
                        }, calendarEvent));

                        // Compute the number of days between the inquiry start and end date
                        numberOfDaysBetween = Math.round(Math.abs((inquiryEndDate - inquiryStartDate)/(1000 * 60 * 60 * 24)));
                        currentDate = inquiryStartDate;

                        // For each day between the inquiry stay dates add a full inquiry day to the dates
                        for(j = numberOfDaysBetween - 1; j >= 1; j--) {
                            currentDate.setDate(currentDate.getDate() + 1);
                            dates.push(resolveDateAndEvent({
                                'date': this.formatDate(currentDate),
                                'duration': 'full',
                                'reservationId': reservationId
                            }, calendarEvent));
                        }

                        // Append the inquiry end date to the dates as an am inquiry day
                        dates.push(resolveDateAndEvent({
                            'date': endDate,
                            'duration': 'am',
                            'reservationId': reservationId
                        }, calendarEvent));
                        /* Remove the calendar event associated with the day range because the checkout day is already
                        added and doesn't need to be added at the bottom. */
                        delete calendarEvents[calendarData[key].reservationId];
                    }
                    // Else just append the default calendar date
                    else {
                        dates.push(resolveDateAndEvent($.extend(true, {'date': key}, calendarData[key]), calendarEvent));
                    }
                }

                /* Loop through all of the calendar events and add a calendar day for each
                check out day since checkout days are not included in the calendar data. */
                for(key in calendarEvents) {
                    dates.push(resolveDateAndEvent({
                        'date': calendarEvents[key].checkoutDate,
                        'reservationId': key
                    },
                    calendarEvents[key]));
                }

                /* Once all of the dates have been created, loop through the dates and fix any overlapping conflicts that there may be. */
                for(i = dates.length - 1; i >= 0; i--) {

                    for(j = dates.length - 1; j >= 0; j--) {

                        // if there are two events that fall on the same day
                        if(i !== j && dates[i].date === dates[j].date && dates[i].startDate && dates[i].endDate) {

                            // if the two events are both full day events
                            if(dates[i].duration === "full" && dates[j].duration === "full") {

                                /* if the start date of the first event is greater then the second, drop the second date
                                        jjjjiiiijjjjj */
                                if(this.reverseFormatDate(dates[i].startDate) > this.reverseFormatDate(dates[j].startDate)) {
                                    dates.splice(j, 1);
                                }
                                /* if the start date of the first event is less then the second, drop the first date
                                        iiiijjjjj */
                                else if(this.reverseFormatDate(dates[i].startDate) < this.reverseFormatDate(dates[j].startDate)) {
                                    dates.splice(i, 1);
                                }
                                /* else the the start date of the first event is equal to the start date of the second event.
                                    xxxx (x represents i and j) */
                                else {
                                    /* if the the end date of the first event is greater then the end date of the second event 
                                        xxxxjjjjiiii */
                                    if(this.reverseFormatDate(dates[i].endDate) > this.reverseFormatDate(dates[j].endDate)) {
                                        dates.splice(i, 1);
                                    }
                                    /* else the the end date of the first event is less then the end date of the second event 
                                        xxxxiiiijjjj */
                                    else if(this.reverseFormatDate(dates[i].endDate) < this.reverseFormatDate(dates[j].endDate)) {
                                        dates.splice(j, 1);
                                    }
                                    /* else the the end date of the first event is equal to the end date of the second event 
                                        xxxxxxxx
                                     in this instance, the event that is not a reserve event is removed. 
                                     **NOTE: this assumes that there will only ever be one reserve event per day. */
                                    else {
                                        (dates[i].status === 'reserve') ? dates.splice(j, 1): dates.splice(i, 1);
                                    }
                                }
                                break;
                            }
                            /* else the first event is an end day and the second event is a full day */
                            else if(dates[i].duration === "pm" && dates[j].duration === "full") {
                                dates[j].duration = "am";
                                break;
                            }
                            /* else the first event is a beginning day and the second event is a full day */
                            else if(dates[i].duration === "am" && dates[j].duration === "full") {
                                dates[j].duration = "pm";
                                break;
                            }
                            /* else the first event is a beginning day and the second event is a beginning day */
                            else if(dates[i].duration === "am" && dates[j].duration === "am") {
                                /* if the the end date of the first event is greater then the end date of the second event 
                                    xxxxjjjjiiii */
                                if(this.reverseFormatDate(dates[i].endDate) > this.reverseFormatDate(dates[j].endDate)) {
                                    dates.splice(i, 1);
                                }
                                /* else the the end date of the first event is less then the end date of the second event 
                                    xxxxiiiijjjj */
                                else if(this.reverseFormatDate(dates[i].endDate) < this.reverseFormatDate(dates[j].endDate)) {
                                    dates.splice(j, 1);
                                }
                                /* else the the end date of the first event is equal to the end date of the second event 
                                    xxxxxxxx
                                 in this instance, the event that is not a reserve event is removed. 
                                 **NOTE: this assumes that there will only ever be one reserve event per day. */
                                else {
                                    (dates[i].status === 'reserve') ? dates.splice(j, 1): dates.splice(i, 1);
                                }
                                break;
                            }
                            else if(dates[i].duration === "pm" && dates[j].duration === "pm") {
                                /* if the start date of the first event is greater then the second, drop the second date
                                        jjjjiiiijjjjj */
                                if(this.reverseFormatDate(dates[i].startDate) > this.reverseFormatDate(dates[j].startDate)) {
                                    dates.splice(j, 1);
                                }
                                /* else the start date of the first event is less then the second, drop the first date
                                        iiiijjjjj */
                                else if(this.reverseFormatDate(dates[i].startDate) < this.reverseFormatDate(dates[j].startDate)) {
                                    dates.splice(i, 1);
                                }
                                /* else the the end date of the first event is equal to the end date of the second event 
                                    xxxxxxxx
                                 in this instance, the event that is not a reserve event is removed. 
                                 **NOTE: this assumes that there will only ever be one reserve event per day. */
                                else {
                                    (dates[i].status === 'reserve') ? dates.splice(j, 1): dates.splice(i, 1);
                                }
                            }
                        }
                    }
                }
                return dates;
            },

            /** Get an array of calendar data containing all days for default dates set.
             * @return {Array} calendar Array of calendar data objects. */
            getDefaultDates: function() {
                return this.resolveDates($.extend(true, {}, this.get("defaultCalendar")), $.extend(true, {}, this.get('defaultCalendarEvents')));
            },

            /** Gets all reservations associated with an id.
             * @return {Array} reservations An array of reservation objects. */
            getReservationsById: function(id) {
                return _.where($.extend(true, [], this.get("calendar")), { 'reservationId': id });
            },

            /** Takes a date object and returns it in the form of YYYY-MM-DD
             * @param {Date} date Date object to format
             * @return {String} date String representation of a date formatted as YYYY-MM-DD */
            formatDate: function(date) {
                var day   = date.getDate().toString();
                var month = (date.getMonth() + 1).toString();
                return date.getFullYear().toString() + '-' + (month[1] ? month : "0" + month[0]) + '-' + (day[1] ? day : "0" + day[0]);
            },

            /** Takes a string in the form of YYYY-MM-DD and returns a date object
             * @param {String} date String representation of a date formatted as YYYY-MM-DD
             * @return {Date} date Date object to format */
            reverseFormatDate: function(date) {
                var dateParts = date.split('-');
                return new Date(parseInt(dateParts[0], 10), (parseInt(dateParts[1], 10) - 1), parseInt(dateParts[2], 10));
            },

            url: function() {
                return this.get('url') + this.get('propertyId') + '?startDate=' + this.get('startDate') + '&endDate=' + this.get('endDate');
            }
        });

        // Extend the datepicker to have an aftershow method. This is used to bind the hover events to the calendar.
        if(!$.datepicker._updateDatepicker.modified) {
            $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
            $.datepicker._updateDatepicker = function(inst) {
                $.datepicker._updateDatepicker_original(inst);
                var afterShow = this._get(inst, 'afterShow');

                if (afterShow) afterShow.apply((inst.input ? inst.input[0] : null));
            };
            /* This is a custom flag added to the datepicker so that in case a user recreates a datepicker on an object it
            won't exceed the callstack by continually extending the global function. */
            $.datepicker._updateDatepicker.modified = true;
        }

        this.View = Backbone.View.extend(/** @lends CalendarView.prototype */{
            /* @class CalendarView
            * @author Phillip Whisenhunt
            * @augments Backbone.View
            * @requires jQuery
            * @requires Backbone.js
            * @requires Underscore.js
            * @contructs CalendarView object
            *
            * Model change should ALWAYS be used for rendering the view because it will trigger the correct render function. */
            initialize: function(options) {
                var that = this;

                _.bindAll(this, 'fetchData', 'extendOptionsFunction');

                for(var key in options.clicked) {
                    this.extendOptionsFunction(key, options.clicked);
                }

                // Extend the properties of the view with the click/hovered/error functions, hover classes, and end calendar
                $.extend(true, this, { 
                    clicked: options.clicked,
                    hovered: options.hovered,
                    error: options.error,
                    endCalendar: options.endCalendar,
                    hoverClass: options.hoverClass,
                    hoverClassStart: options.hoverClassStart,
                    hoverClassEnd: options.hoverClassEnd,
                    fetching: options.fetch,
                    currentElement: undefined
                 });

                // In case there is not Backbone Layout manager, bind to after render.
                if(!Backbone.Layout) {
                    _.bindAll(this, 'afterRender');
                    this.on('render', this.afterRender, this);
                }

                this.model.on('error', function(error) {
                    that.$el.trigger('error', error);
                    that.error(error);
                });

                // If the start date has changed then fetch data!
                this.model.on('change:startDate', function() {
                    that.fetchData(options.fetch);
                });

                this.fetchData(options.fetch);
            },

            /** Extends an objects function to trigger a jQuery custom jQuery event on the el of the view.
             *  The key is broadcasted as the event. This is primarily used to extend click events so that
             *  a click event is triggered.
             * @param {String} key The key of the object for the function that you wish to override
             * @param {Object} object The object that has the function that you wish to trigger a jQuery event for. */
            extendOptionsFunction: function(key, object) {
                var that = this;
                var cachedFunction = object[key];
                object[key] = function(element, reservation) {
                    // Trigger a jQuery custom event
                    that.$el.trigger(key, [element, reservation]);
                    cachedFunction.call(this, element, reservation);
                };
            },

            /** Fetchs data from the endpoint.
             * @param {boolean} fetching Determines wether to fetch data or not.
             * @param {boolean} bool Returns false */
            fetchData: function(fetching) {
                var that = this;

                // Switch fetch to on so that the loader is displayed
                this.fetching = fetching;
                // Trigger a change which will rerender the datepicker.
                this.afterRender();

                if(this.model.get('propertyId') && this.fetching){

                    this.model.fetch({
                        complete: function() {
                            that.fetching = false;
                            that.afterRender();
                        }
                    });
                }
                return false;
            },

            /** Creates a calendar instance. This is used to create inline and date picker calendars and it takes in a hash
             *  of parameters. The key values that it expects are as follows.
             *  el - the dom element to create the datepicker for
             *  isEndCalendar - a boolean detailing if the calendar being created is an end calendar, this is used for when you
             *          you are creating two datepicker calendars.
             *  endCalendar - the dom element of the second calendar in case you are creating two date picker calendars. this should
             *          be passed in during the creation of the first calendar.
             *  startCalendar - the dom element of the first calendar in case you are creating two date picker calendars. this should
             *          be passed in during the creation of the second calendar.
             * @param {Object} params a params object that can contain, el, isEndCalendar, endCalendar, and startCalendar */
            createCalendar: function(params) {
                var el            = params.el;
                var isEndCalendar = params.isEndCalendar;
                var endCalendar   = params.endCalendar;
                var startCalendar = params.startCalendar;
                var calendar      =  $.extend(true, [], this.model.get("calendar"));
                var that          = this;
                // Convert the string default date YYYY-MM-DD to a date object for the date picker
                var defaultDate   = this.model.reverseFormatDate(this.model.get('defaultDate'));
                var locale        = this.model.get('locale');
                // The ID of the currently hovered event.
                var currentId;

                el.datepicker('destroy').datepicker({

                    minDate: this.model.get('minDate'),

                    maxDate: this.model.get('maxDate'),

                    defaultDate: defaultDate,

                    firstDay: this.model.get('startOfWeek'),

                    showButtonPanel: this.model.get("showButtonPanel"),

                    numberOfMonths: this.model.get("numberOfMonths"),

                    /** Before each date is shown on the screen apply the correct styling.
                     * @param {Date} date object of each date being displayed */
                    beforeShowDay: function(date) {
                        // The selected date for the first calendar.
                        var selectedStartDate = that.model.get('startCalendarDate');
                        // The selected date for the second calendar.
                        var selectedEndDate   = that.model.get('endCalendarDate');
                        // The currently hovered end date of the second calendar.
                        var hoveredEndDate    = that.model.hoveredEndDate;
                        // The currently hovered end date of the first calendar.
                        var hoveredStartDate  = that.model.hoveredStartDate;
                        var style             = [];
                        var formattedDate, i, cachedStyle;

                        // Convert the date to the format returned by the backend YYYY-MM-DD
                        date = that.model.formatDate(date);

                        /* Loop through all of the calendar days and calculate the style. Start calculating style
                        from the end of the calendar. This is done so that the first class, which represents the
                        id of the reservation, is added first. */
                        for(i = calendar.length - 1; i > -1; i--) {

                            if(calendar[i].date === date) {
                                style.push(' ' + calendar[i].duration + '-' + calendar[i].status.toLowerCase() + ' X' + calendar[i].reservationId + 'X');
                            }
                        }
                        /* Since dates are manipulated in the resolveDates function, events can sometimes be calculated as
                            pm-status XidX am-status XidX which will create issues with the hovering and highlighting of events
                            because am is expected to be first. Therefore, check to see if the calculated style is out of order.
                            If they are out of order, swap the am and pm style. */
                        if(style.length === 2 && style[0].indexOf('pm-') !== -1 && style[1].indexOf('am-')) {
                            cachedStyle = style[0];
                            style[0] = style[1];
                            style[1] = cachedStyle;
                        }

                        formattedDate = that.model.reverseFormatDate(date);

                        /* Check to see if there is an end calendar because if there is then that means that the user is using the widget as a datepicker
                            and that this is the first calendar being drawn. */
                        if(endCalendar) {
                            // Color the current date if ...
                            // If the current date is less then the selected second calendar date and the current date is greater then the selected start date
                            if(formattedDate < selectedEndDate && formattedDate > selectedStartDate
                                // Or, if the current date is less then the selected start date and the current date is greater then the start hover date
                                || formattedDate < selectedStartDate && formattedDate > hoveredStartDate
                                // Or, if the current date is equal to the selected start and end date
                                || selectedStartDate && selectedEndDate && selectedStartDate.toString() === formattedDate.toString()
                                    && selectedEndDate.toString() === selectedStartDate.toString()
                                // Or, if the current date is the selected start date and the start hover date is before the selected date
                                || selectedStartDate && hoveredStartDate
                                    && hoveredStartDate < selectedStartDate
                                    && selectedStartDate.toString() === formattedDate.toString()) {
                                style.push(that.hoverClass);
                            }
                            // Or, if the current date is equal to the selected start date
                            else if(selectedStartDate && selectedStartDate.toString() === formattedDate.toString()
                                // Or, if the current date is equal to the hoevered start date
                                || hoveredStartDate && hoveredStartDate.toString() === formattedDate.toString()) {
                                style.push(that.hoverClassStart);
                            }
                            // Or, if the current date is the equal to the selected end date
                            else if(selectedEndDate && selectedEndDate.toString() === formattedDate.toString()){
                                style.push(that.hoverClassEnd);
                            }
                        }
                        /* Else are we calculating the style for the second date picker calendar? */
                        else if(isEndCalendar) {
                            // Color the current date if ...
                            // If the curent date is between the selected first date and end hover date and the selected first date is less then end hover date
                            if(selectedStartDate < hoveredEndDate && selectedStartDate < formattedDate && formattedDate < hoveredEndDate 
                                // Or, if the current date is greater then the selected date and less then the selected end date
                                || selectedEndDate && formattedDate > selectedStartDate && formattedDate < selectedEndDate
                                // Or, if the current date is equal to the selected start and end date
                                || selectedStartDate && selectedEndDate 
                                    && selectedStartDate.toString() === formattedDate.toString()
                                    && selectedEndDate.toString() === selectedStartDate.toString()
                                ) {
                                style.push(that.hoverClass);
                            }
                            // Or, if the current date is equal to the selected start date
                            else if(selectedStartDate && selectedStartDate.toString() === formattedDate.toString()) {
                                style.push(that.hoverClassStart);
                            }
                            // Or, if the current date is equal to the selected end date
                            else if(selectedEndDate && formattedDate.toString() === selectedEndDate.toString()
                                // Or, if the current date is equal to the end hover date
                                || hoveredEndDate && formattedDate.toString() === hoveredEndDate.toString()) {
                                style.push(that.hoverClassEnd);
                            }
                        }

                        // Return the style and a blank tooltip.
                        return [true, style.join(''), ''];
                    },

                    /** Whenever the calendar is navigated, calculate if the user is within the bounds of data
                     * that has been fetched. If they are, then set new bounds, which triggers a fetch.
                     * @param {Number} year The year that is currently navigated to
                     * @param {Number} month The month that is currently navigated to
                     * @param {Element} element The date picker instance
                     * @param {boolean} bool Returns false */
                    onChangeMonthYear: function(year, month, element) {
                        if(that.fetching) {
                            var startDate            = that.model.reverseFormatDate(that.model.get('startDate'));
                            var endDate              = that.model.reverseFormatDate(that.model.get('endDate'));
                            // The number of months in the model
                            var numberOfMonths       = that.model.get('numberOfMonths');
                            // The computed number of months from the model, in case the number of months is an array this stores the true number of months
                            var actualNumberOfMonths = numberOfMonths;
                            // The number of months to the left and right boundaries of the data that was fetched
                            var monthsToLeft         = 0;
                            var monthsToRight        = 0;
                            // The currently displayed left and right months of the calendar
                            var farLeftMonth         = new Date(year, (month - 1), 1);
                            var farRightMonth, i;

                            // If the number of months is an array then calculate the number of months from the array.
                            if(Object.prototype.toString.call(numberOfMonths) === '[object Array]') {

                                actualNumberOfMonths = 0;
                                for(i = numberOfMonths.length - 1; i >= 0; i--) {
                                    actualNumberOfMonths += numberOfMonths[i];
                                }
                            }
                            // Calculate the number of months from the start of data fetched to the far left most calendar displayed
                            monthsToLeft = (farLeftMonth.getFullYear() - startDate.getFullYear()) * 12;
                            monthsToLeft -= startDate.getMonth() + 1;
                            monthsToLeft += farLeftMonth.getMonth();

                            farRightMonth = new Date(farLeftMonth.setMonth(farLeftMonth.getMonth() + actualNumberOfMonths - 2));
                            // Calculate the number of months from the end of data fetched to the far right most calendar displayed
                            monthsToRight = (endDate.getFullYear() - farRightMonth.getFullYear()) * 12;
                            monthsToRight -= farRightMonth.getMonth() + 1;
                            monthsToRight += endDate.getMonth();

                            // If we are within 1 month of data then set new boundaries, which will trigger a fetch!
                            if(monthsToRight < 1 || monthsToLeft < 1) {
                                that.model.setDataBounds(new Date(year, (month - 1), 1));
                            }
                        }
                        return false;
                    },

                    afterShow: function() {
                        /* If there is an end calendar, that means that the user is using the calendar widget as a date picker so every ui-state-default or
                            table cell should have a hover state added to it. If the user is using an inline calendar only bind events to table cells
                            that have a reservation added to them. */
                        (isEndCalendar ? $('.ui-state-default'): $(".ui-state-default", "[class*=X]")).hover(

                            // On mouse hover
                            function(e) {
                                /* Parent class is in the form of:

                                    duration-status XidX duration-status XidX

                                    During the construction of the class, the am element will always be first and the pm item
                                    will always be last. Splitting along the X delimiter yields [1] as the first id and [3] as the second id. The [0] and [2] positions contain the statuses for the ids.
                                    
                                    Note: CSS Hovers are not used here because a table cell can have two classes on it at the same time. Therefore, the actual reservation that is being 
                                    hovered must be calculated.
                                */
                                var parentClass      = $(this).parent().attr('class');
                                var parentClassParts = parentClass.split("X");
                                // The currently hovered end date of the second calendar.
                                var hoveredEndDate   = that.model.hoveredEndDate;
                                // The currently hovered end date of the first calendar.
                                var hoveredStartDate = that.model.hoveredStartDate;
                                var id, status, onClickAttributeParts, newHoveredDate;

                                // If the cell contains an ID
                                if(parentClass.indexOf('X') !== -1) {

                                    // set the id to the first id present
                                    id = parentClassParts[1];

                                    /* If there are more then 2 different IDs for a given day then determine which
                                        part of the day is being hovered. Which part of the day is determined by
                                        calculating the relative X and relative Y of the mouse to the cell being hovered.
                                        If the relative X and Y are less then half of the width of the table cell
                                        then the user is hovering the am or top event. */
                                    if((parentClassParts.length - 1) > 3) {

                                        $(this).unbind('mousemove').mousemove(function(e) {
                                            var parentOffset = $(this).parent().offset();
                                            var relativeX    = e.pageX - parentOffset.left;
                                            var relativeY    = e.pageY - parentOffset.top;
                                            // Calculate the diagnol as half of the width of the table cell
                                            var diaganol     = $(this).parent().width() / 2;

                                            // Remove the hover style for all days tied to either of the 2 ids.
                                            swtichClassBasedOnHover(id, false, status);
                                            swtichClassBasedOnHover(parentClassParts[3], false, status);

                                            // If the user is above the cell on the am event, set the id and determine the hover status.
                                            if(relativeX < diaganol && relativeY < diaganol) {
                                                status = determineStatus(parentClassParts[0]);
                                                id = parentClassParts[1];

                                                // If the user is hovering on the inquiry status, then switch to the other event!
                                                if(status === 'inquiry') {
                                                    status = parentClassParts[2];
                                                    id = parentClassParts[3];
                                                }
                                            }
                                            else {
                                                // Else the user is below the cell on the pm event, set the id and determine the hover status.
                                                status = determineStatus(parentClassParts[2]);
                                                id = parentClassParts[3];

                                                // If the user is hovering on the inquiry status, then switch to the other event!
                                                if(status === 'inquiry') {
                                                    status = parentClassParts[0];
                                                    id = parentClassParts[1];
                                                }
                                            }
                                            // Only trigger a custom hover if the user switches to a new event.
                                            if(currentId !== id) {
                                                that.currentElement = $(this);
                                                that.hovered.on($(this), that.model.getReservationsById(id));
                                            }
                                            currentId = id;
                                            status = determineStatus(status);
                                            swtichClassBasedOnHover(id, true, status);
                                        });
                                    }
                                    /* Else if the user is hovering a cell with a single event. */
                                    else {
                                        currentId = id;
                                        status = determineStatus(parentClass);
                                        swtichClassBasedOnHover(id, true, status);
                                    }
                                    that.currentElement = $(this);
                                    // Call the custom hover event if it exists.
                                    that.hovered.on($(this), that.model.getReservationsById(id));
                                }

                                // If the date is selected, as in there is an onclick event
                                if($(this).parent().attr('onclick')){
                                    // Parse out the day that is being hovered, set the currently hovered date, and refresh the datepicker
                                    //DP_jQuery.datepicker._selectDay('#dp1361889444024',1,2013, this);return false;
                                    onClickAttributeParts = $(this).parent().attr('onclick').split(',');
                                    newHoveredDate = that.model.reverseFormatDate(onClickAttributeParts[2] + '-' + (parseInt(onClickAttributeParts[1], 10) + 1) + '-' + $(this).html());

                                    // If the calendar is the second calendar or end calendar and if the hoveredEndDate is different then the currently selected date then set it
                                    if(isEndCalendar && (!hoveredEndDate || hoveredEndDate.toString() !== newHoveredDate.toString())) {
                                        that.model.hoveredEndDate = newHoveredDate;
                                        el.datepicker('refresh');
                                    }
                                    // If the hoveredStartDate is different then the currently selected date then set it
                                    else if(!hoveredStartDate || hoveredStartDate.toString() !== newHoveredDate.toString()) {
                                        /* storing the hover start date in the model directly causes the model to store a reference of the variable
                                        so garbage collection doesn't happen. This fixes that. */
                                        that.model.hoveredStartDate = newHoveredDate;
                                        el.datepicker('refresh');
                                    }
                                }
                            },
                            // On the user leaving mouse hover
                            function(e) {
                                /* Parent class is in the form of:

                                    duration-status XidX duration-status XidX

                                    During the construction of the class, the am element will always be first and the pm item
                                    will always be last. Splitting along the X delimiter yields [1] as the first id and [3] as
                                    the second id.
                                */
                                var parentClass      = $(this).parent().attr('class');
                                var parentClassParts = parentClass.split("X");
                                var id               = parentClassParts[1];

                                // If there are 2 ids present then remove all hover events for the second id.
                                if((parentClassParts.length - 1) > 3) {
                                    swtichClassBasedOnHover(parentClassParts[3], false, '');
                                    that.currentElement = $(this);
                                    that.hovered.off($(this), that.model.getReservationsById(id));
                                }
                                if(id) {
                                    swtichClassBasedOnHover(id, false, '');
                                    that.currentElement = $(this);
                                    that.hovered.off($(this), that.model.getReservationsById(id));
                                }
                            }
                        );

                        /* Determines the status(hold, reserve, unavailable, etc.) for a given string.
                         * @param {String} classAttribute String representing the classes of an element. */
                        function determineStatus(classAttribute) {

                            if(classAttribute.indexOf('reserve') !== -1){
                                return 'reserve';
                            }
                            else if(classAttribute.indexOf('hold') !== -1){
                                return 'hold';
                            }
                            else if(classAttribute.indexOf('delete') !== -1){
                                return 'delete';
                            }
                            else if(classAttribute.indexOf('cancel') !== -1){
                                return 'cancel';
                            }
                            else if(classAttribute.indexOf('unavailable') !== -1){
                                return 'unavailable';
                            }
                            else if(classAttribute.indexOf('inquiry') !== -1){
                                return 'inquiry';
                            }
                            return '';
                        }

                        /* Switches the calendars hover state for a given event based on id.
                         * @param {String} id String representing the classes of an element.
                         * @param {boolean} isHovered Boolean determining if the hover state should be added or removed.
                         * @param {String} status String of the status(hold, reserve, unavailable, etc.) to add to an element. */
                        function swtichClassBasedOnHover(id, isHovered, status) {
                            // If we are on an inquiry, don't do anything!
                            if(status !== 'inquiry') {

                                var cell, cells, cellClass, cellClassParts, i;

                                // grab all of the cells with the given delimited id
                                cells = el.find('.X' + id + 'X');

                                if(isHovered) {
                                    // Loop through all of the cells and add the correct status hover class.
                                    for(i = cells.length - 1; i >= 0; i--) {
                                        cell = $(cells[i]);

                                        cellClassParts = cell.attr('class').split('X');

                                        /* Determine which part of the class corresponds to the ID being hovered.
                                            This is put place so that in case there are two events of the same type,
                                            only the event corresponding to the ID will have its class changed. */
                                        if(cellClassParts[1] === id){
                                            cellClassParts[0] = cellClassParts[0].replace('full-' + status, 'full-' + status + '-hover');
                                            cellClassParts[0] = cellClassParts[0].replace('am-' + status, 'am-' + status + '-hover');
                                            cellClassParts[0] = cellClassParts[0].replace('pm-' + status, 'pm-' + status + '-hover');
                                        }
                                        else {
                                            cellClassParts[2] = cellClassParts[2].replace('full-' + status, 'full-' + status + '-hover');
                                            cellClassParts[2] = cellClassParts[2].replace('am-' + status, 'am-' + status + '-hover');
                                            cellClassParts[2] = cellClassParts[2].replace('pm-' + status, 'pm-' + status + '-hover');
                                        }
                                        cell.attr('class', cellClassParts.join('X'));
                                    }
                                }
                                else {
                                    // Loop through all of the cells and remove any hover classes.
                                    for(i = cells.length - 1; i >= 0; i--) {
                                        // Unbind the mousemove event from each cell, helps memory cleanup :)
                                        cell = $(cells[i]).unbind('mousemove');
                                        cellClass = cell.attr('class');
                                        cellClass = cellClass.replace(/-hover/g, '');
                                        cell.attr('class', cellClass);
                                    }
                                }
                            }
                        }
                    },

                    /* Fires when a specific date is clicked on the calendar.
                     * @param {String} dateText String representation of the date clicked on. 
                     * @param {Object} element instance of the datepicker */
                    onSelect: function(dateText, element) {
                        // The selected date for the first calendar.
                        var selectedStartDate = that.model.get('startCalendarDate');
                        // The selected date for the second calendar.
                        var selectedEndDate   = that.model.get('endCalendarDate');
                        var dateTextParts     = dateText.split('/');
                        var date              = dateTextParts[2] + '-' + dateTextParts[0] + '-' + dateTextParts[1];
                        var startIsEndMinimum = that.model.get('startIsEndMinimum');
                        var i, newSelectedStartDate;

                        // STOP THE DATEPICKER FROM REDRAWING ON CLICK! OMG!
                        element.inline = false;

                        // Find the correct date that we clicked on and trigger the corresponding status function.
                        for(i = calendar.length - 1; i >= 0; i--) {

                            if(calendar[i].date === date && calendar[i].reservationId === currentId) {

                                // Check if there is a function for that status
                                if(that.clicked[calendar[i].status.toLowerCase()]){
                                    that.clicked[calendar[i].status.toLowerCase()](that.currentElement, calendar[i]);
                                }
                                // Trigger a jQuery event for the status clicked if there isn't a function for the status
                                // If this is a calendar for an end calendar, be sure to trigger the change on the first calendar
                                else if(isEndCalendar) {
                                        startCalendar.trigger(calendar[i].status.toLowerCase(), that.currentElement, calendar[i]);
                                }
                                else {
                                    el.trigger(calendar[i].status.toLowerCase(), that.currentElement, calendar[i]);
                                }
                            }
                        }

                        // If the user selected a date on the end calendar
                        if(isEndCalendar) {
                            newSelectedEndDate = that.model.reverseFormatDate(date);

                            // If the selected end date is new or different, broadcast a changed event
                            if(!selectedEndDate || newSelectedEndDate.toString() !== selectedEndDate.toString()) {
                                el.trigger('changed');
                            }
                            selectedEndDate = newSelectedEndDate;
                            that.model.set('endCalendarDate', selectedEndDate);
                        }
                        // Else the user selected a date on the first calendar or start calendar
                        else {
                            newSelectedStartDate = that.model.reverseFormatDate(date);

                            // If the selected start date is new or different, broadcast a change event
                            if(!selectedStartDate || newSelectedStartDate.toString() !== selectedStartDate.toString()) {
                                el.trigger('changed');
                            }
                            selectedStartDate = newSelectedStartDate;

                            // If the user passed in the option to set the minimum date of the end calendar to the start calendar, set the min date of the end calendar
                            if(startIsEndMinimum) {
                                endCalendar.datepicker('option', 'minDate', selectedStartDate);
                            }
        
                            // If there is an end calendar passed in, then set the selected start date
                            if(endCalendar) {
                                that.model.set('startCalendarDate', selectedStartDate);                                                                
                            }
                        }
                    },

                    /* Fires when the datepicker is closed.
                     * @param {String} dateText String representation of the date clicked on.
                     * @param {DatePicker} element The datepicker instance. */
                    onClose: function(dateText, element) {
                        // The selected date for the first calendar.
                        var selectedStartDate = that.model.get('startCalendarDate');
                        // The selected date for the second calendar.
                        var selectedEndDate   = that.model.get('endCalendarDate');
                        // The currently hovered end date of the second calendar.
                        var hoveredEndDate    = that.model.hoveredEndDate;
                        // The currently hovered end date of the first calendar.
                        var hoveredStartDate  = that.model.hoveredStartDate;

                        /* Set the hover start date and end date to undefined because the calendar is being closed and there aren't
                            any days being hovered anymore. This is necessary so that hover dates won't be painted in redraws. */
                        that.model.hoveredStartDate = undefined;
                        that.model.hoveredEndDate = undefined;

                        // If there are two calendars present and we are on the first calendar
                        if(endCalendar) {
                            // When the first date picker closes refresh it and unfocus the datepicker
                            el.datepicker('refresh').trigger('blur');

                            // If the user selects a start date that is greater then the second date then set the second date equal to the start date
                            if(selectedStartDate && (selectedEndDate < selectedStartDate || !selectedEndDate)) {
                                // Create a copy of the start date
                                selectedEndDate = new Date(selectedStartDate.getTime());
                                // Set the second calendars start date to a day after the first calendars start date
                                selectedEndDate.setDate(selectedEndDate.getDate() + 1);
                                that.model.set('endCalendarDate', selectedEndDate);
                                endCalendar.datepicker('setDate', selectedEndDate);
                                endCalendar.trigger('changed');
                            }                        
                        }
                        // If we are on the second calendar
                        if(isEndCalendar) {
                            // Redraw the calendar to remove any hover coloring that may have been overlayed
                            el.datepicker('refresh').trigger('blur');

                            // If the user selects an end date that is less then the start date set the start date to the end date, update the first calendar
                            if(!selectedStartDate || selectedStartDate > selectedEndDate) {
                                // Create a copy of the date
                                selectedStartDate = new Date(selectedEndDate.getTime() - 1);
                                that.model.set('startCalendarDate', selectedStartDate);
                                startCalendar.datepicker('setDate', selectedStartDate);
                                startCalendar.trigger('changed');
                            }
                        }
                    }
                });
            },

            afterRender: function() {
                // The selected date for the first calendar.
                var selectedStartDate = this.model.get('startCalendarDate');
                // The selected date for the second calendar.
                var selectedEndDate   = this.model.get('endCalendarDate');
                var that              = this;

                this.createCalendar({
                    el: this.$el,
                    isEndCalendar: false,
                    endCalendar: this.endCalendar ? $(this.endCalendar): undefined,
                    startCalendar: undefined
                });

                // If the user passed in a default start date for the first calendar set the first calendar to that date.
                if(selectedStartDate) {
                    this.$el.datepicker('setDate', selectedStartDate);
                }

                // If the user has passed in an end calendar create the second date picker
                if(this.endCalendar) {
                    // If there isn't a selected first date selected when the user opens the second calendar trigger the first calendar to open
                    $(this.endCalendar).on('click', function(event) {

                        if(!that.model.get('startCalendarDate')) {
                            $(this).trigger('blur');
                            that.$el.trigger('focus');
                        }
                    });

                    this.createCalendar({
                        el: $(this.endCalendar),
                        isEndCalendar: true,
                        endCalendar: undefined,
                        startCalendar: this.$el
                    });

                    // If the user passed in a default start date for the end calendar set the end calendar to that date.
                    if(selectedEndDate) {
                        $(this.endCalendar).datepicker('setDate', selectedEndDate);
                    }
                }

                // Once the datepicker is rendered append a loading class div and only display it if the endpoint is finished fetching data.
                this.$el.append('<div class="calendar-loading" style="width: ' + this.$el.width() + 'px; height: ' + this.$el.height() + 'px; display:' + (this.fetching ? "block" : "none") + ';"></div>');
                return this;
            }
        });

        /* If the user is passing in a language to use then use those keys. Currently
            it is enforced to use mm/dd/yy for easy parsing of dates. */
        if(options.language) {
            $.datepicker.regional.custom = {
                closeText: options.language.closeText,
                prevText: options.language.previous,
                nextText: options.language.next,
                currentText: options.language.currentText,
                monthNames: options.language.monthNames,
                monthNamesShort: options.language.monthNamesShort,
                dayNames: options.language.dayNames,
                dayNamesShort: options.language.dayNamesShort,
                dayNamesMin: options.language.dayNamesMin,
                weekHeader: options.language.weekHeader,
                dateFormat: 'mm/dd/yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            }
            $.datepicker.setDefaults($.datepicker.regional.custom);
        }
   
        // Extend the default attributes with the options. This will get rid of any undefined vars.
        options = $.extend(true, {}, $.fn.calendar.defaults, options);

        this.model = this.model || new this.Model({
            defaultDate: options.defaultDate,
            numberOfMonths: options.numberOfMonths,
            propertyId: options.propertyId,
            defaultCalendar: options.calendar,
            defaultCalendarEvents: options.reservations,
            url: options.url,
            startOfWeek: options.startOfWeek,
            minDate: options.minDate,
            maxDate: options.maxDate,
            startCalendarDate: options.startCalendarDate,
            endCalendarDate: options.endCalendarDate,
            startIsEndMinimum: options.startIsEndMinimum,
            showButtonPanel: options.showButtonPanel
        });
        this.view = this.view || new this.View({
            el: options.el,
            model: this.model,
            clicked: options.clicked,
            error: options.error,
            fetch: options.fetch,
            hovered: options.hovered,
            endCalendar: options.endCalendar,
            hoverClass: options.hoverClass,
            hoverClassStart: options.hoverClassStart,
            hoverClassEnd: options.hoverClassEnd
        });
    };

    /* CALENDAR PLUGIN DEFINITION
    * ======================== */
    var old = $.fn.calendar;

    $.fn.calendar = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('calendar');
            var options = typeof option == 'object' && option;
            if(!options) options = {};
            options.el = $this;
            if (!data) $this.data('calendar', (data = new Calendar(options)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.calendar.Constructor = Calendar;

    /* CALENDAR NO CONFLICT
    * ================== */
    $.fn.calendar.noConflict = function () {
        $.fn.calendar = old;
        return this;
    };

    // Defaults for the calendar.
    $.fn.calendar.defaults = {
        // The el to bind the end calendar to
        'endCalendar': undefined,
        // The class to add to hovered dates between two input date pickers
        'hoverClass': '',
        // The class to add to the start of hovered dates between two input date pickers
        'hoverClassStart': '',
        // The class to add to the end of hovered dates between two input date pickers
        'hoverClassEnd': '',
        // The start of the week for the calendar.
        'startOfWeek': 0,
        // The default date to start the date picker for.
        'defaultDate': undefined,
        // The start and end dates to fetch data for.
        'endDate': undefined,
        'startDate': undefined,
        // Property id to fetch data for.
        'propertyId': undefined,
        // The number of months to draw.
        'numberOfMonths': 1,
        // Should data be fetched.
        'fetch': true,
        // The minimum date for the calendar
        'minDate': undefined,
        // The maximum date for the calendar
        'maxDate': undefined,
        // The date to set the start calendar to
        'startCalendarDate': undefined,
        // The date to set the end calendar to
        'endCalendarDate': undefined,
        // Is the selected start date of the first calendar the minimum of the second calendar
        'startIsEndMinimum': false,  
        // Determines if the button panel of the datepicker is shown
        'showButtonPanel': false,
        // Default calendar days.
        'calendar': {},
        // Default calendar specific events for days.
        'reservations': {},
        'clicked': {
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
        },
        'hovered': {
            'on': function(element, reservations) {
            },
            'off': function(element, reservations) {
            }
        },
        'error': function(error) {
        },
        'url': '',
        'language': undefined
    };
})();