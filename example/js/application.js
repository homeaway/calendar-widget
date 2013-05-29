   $('.start-calendar').calendar({
        'fetch': false,
        'numberOfMonths': 1,
        'endCalendar': '.end-calendar',
        'hoverClass': 'full-reserve',
        'hoverClassStart': 'pm-reserve',
        'hoverClassEnd': 'am-reserve'
    });


  $('.calendar').calendar({
    'fetch': false,
    'numberOfMonths': [1,3],
    "calendar": {
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
        },
        "2013-02-20": {
            "status": "HOLD",
            "reservationId": "08a0b0b9-6465-42ae-acab-e86ea0103472"
        },
        "2013-02-21": {
            "status": "HOLD",
            "reservationId": "08a0b0b9-6465-42ae-acab-e86ea0103472"
        },
        "2013-02-22": {
            "status": "HOLD",
            "reservationId": "08a0b0b9-6465-42ae-acab-e86ea0103472"
        },
        "2013-02-23": {
            "status": "HOLD",
            "reservationId": "08a0b0b9-6465-42ae-acab-e86ea0103472"
        },
        "2013-02-24": {
            "status": "HOLD",
            "reservationId": "08a0b0b9-6465-42ae-acab-e86ea0103472"
        },
        "2013-03-04": {
            "status": "UNAVAILABLE",
            "reservationId": "2d07c91e-7067-4796-9953-f1250f5697df"
        },
        "2013-03-05": {
            "status": "UNAVAILABLE",
            "reservationId": "2d07c91e-7067-4796-9953-f1250f5697df"
        },
        "2013-03-06": {
            "status": "UNAVAILABLE",
            "reservationId": "2d07c91e-7067-4796-9953-f1250f5697df"
        },
        "2013-03-07": {
            "status": "UNAVAILABLE",
            "reservationId": "2d07c91e-7067-4796-9953-f1250f5697df"
        },
        "2013-03-08": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        },
        "2013-03-09": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        },
        "2013-03-10": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        },
        "2013-03-11": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        },
        "2013-03-11": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        },
        "2013-03-12": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        },
        "2013-03-13": {
            "status": "RESERVE",
            "reservationId": "4c5b1417-70b0-4ba8-9c51-a299b746e69c"
        }
    },
    "reservations": {
        "inquiry": {
            "status": "INQUIRY"
        },
        "24ba2024-f0dd-4c7d-a744-57396d56fd42": {
            "guestFirstName": "Stacy",
            "guestLastName": "Vanderworth",
            "checkinDate": "2013-02-11",
            "checkoutDate": "2013-02-14",
            "checkinTime": "01:30",
            "checkoutTime": "21:00",
            "status": "RESERVE"
        },
        "2d07c91e-7067-4796-9953-f1250f5697df": {
            "guestFirstName": "",
            "guestLastName": "",
            "checkinDate": "2013-03-04",
            "checkoutDate": "2013-03-08",
            "checkinTime": "16:00",
            "checkoutTime": "11:00",
            "status": "UNAVAILABLE"
        },
        "4c5b1417-70b0-4ba8-9c51-a299b746e69c": {
            "guestFirstName": "First",
            "guestLastName": "Last",
            "checkinDate": "2013-03-08",
            "checkoutDate": "2013-03-14",
            "checkinTime": "04:00",
            "checkoutTime": "16:30",
            "status": "RESERVE"
        },
        "08a0b0b9-6465-42ae-acab-e86ea0103472": {
            "guestFirstName": "Martin",
            "guestLastName": "Note",
            "checkinDate": "2013-02-20",
            "checkoutDate": "2013-02-25",
            "checkinTime": "16:00",
            "checkoutTime": "11:00",
            "status": "HOLD"
        }
    },
    'clicked': {
        'hold': function(element, reservation) {
            alert('Hold event clicked!');
        }
    },
    'defaultDate': '2013-01-01'
  });

    $('.calendar').on('reserve', function(e, element, reservation) {
        alert("jQuery event triggered by clicking on reserve event!");
    });