// Initialize Firebase
var config = {
  apiKey: "AIzaSyDxdVdHNcGaY0SllmU8BeActTW12x0-ymQ",
  authDomain: "reservation-site-3f6ae.firebaseapp.com",
  databaseURL: "https://reservation-site-3f6ae.firebaseio.com",
  projectId: "reservation-site-3f6ae",
  storageBucket: "",
  messagingSenderId: "1092080060164"
};
const caret = ' <span class="caret"></span>'
firebase.initializeApp(config);

var database = firebase.database();
var reservationData = {
  name: "",
  day: ""
};

$('.reservation-day li').on('click', function (e) {
  reservationData.day = $(this).find('a').html();
  $(this)
  .parent()
  .parent()
  .find('button')
  .empty()
  .prepend(reservationData.day + caret)
});

$('.reservations').on('submit', function (e) {
  e.preventDefault();
  reservationData.name = $('.reservation-name').val();
  $('#errorMsg')
    .empty()
    .show();
  if (validation(reservationData)) {
    database.ref('reservations').push(reservationData);
    resetFields();
  }
})

$('.reservation-list').on('click', 'tr', function(e) {
  e.preventDefault();
  var id = $(this).data('id');
  cancelReservation(id);
})

function cancelReservation(id) {
  database.ref('reservations').child(id).remove()
}

function resetFields() {
  $('.reservation-name').val('');
  $('#selector')
      .empty()
      .append('Select a day'+caret)
}
function validation (reservationDat) {
  $('#errorMsg').empty();
  if(reservationDat.name !== '' && reservationDat.day !== "") {
    return true
   } else if (reservationDat.name === "" && reservationDat.day === "") {
     $('#errorMsg').text('Please provide a name and a day!').fadeIn().fadeOut(1000);
     return false
   } else if (reservationDat.name === "") {
    $('#errorMsg').text('Please provide a name!').fadeIn().fadeOut(1000);
    return false
  } else if (reservationDat.day === "") {
    $('#errorMsg').text('Please select a day!').fadeIn().fadeOut(1000);
    return false
  } else {
    $('#errorMsg').text('Ups something is wrong!!!').fadeIn().fadeOut(1000);
    return false
  }
}

function getReservations () {
  database.ref('reservations').on('value', function (results) {
    var reservations = results.val();
    var items = [];
    for(var i in reservations) {
      var context = {
        name: reservations[i].name,
        day: reservations[i].day,
        id: i
      }
      var source = $("#reservation-template").html();
      var template = Handlebars.compile(source);
      var reservationListElement = template(context)
      items.push(reservationListElement)
    }
    $('.reservation-list').empty();
    for(var j in items) {
      $('.reservation-list').append(items[j]);
    }
    getReservationCount();
  });
}

function getReservationCount () {
  var reservation_count = $('.reservation-list tr').length
  $('#current_reservation').empty().append('('+reservation_count+')')
}

getReservations();


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.8054491, lng: -73.9654415},
    zoom: 12,
    scrollwheel: false
  });
  var marker = new google.maps.Marker({
    position: {lat: 40.8054491, lng: -73.9654415},
    map: map,
    title: 'Monks Cafe'
  });
}