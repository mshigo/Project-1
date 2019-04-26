//Global Vars

//========================
var database;


var user = {
  userId: 0,
  isProvider: false,
  first: "Watts", // google first name
  middle: "", // google middle name
  last: "App", // google last name
  email: "WattsApp123@gmail.com", // google email
  phone: "111-222-3333",
  region: "Los Angeles", // google region
  pic: "assets/images/pic.png", // google profile picture
  width: 100, // picture width
  height: 100, // picture height
  make: "Tesla", //make of the user's car
  hasCable: "no", // if user has a cable
  address: "510 E Petalson Drive",
  provider: { //main provider object 
    station: { //main station object
      marker: { //google marker for the station
        region: "Los Angeles", // region of the station
        lat: 40.785091, //latitude of the station
        lng: -73.968285 // longitude of the station
      },
      hasCable: "no", //does station have a cable
      isOpen: false, //is the station open for business
      waitTime: 0, //what is the waittime for the station
      services: false, //other available services at the station
      totalSockets: 0, //total available sockets at the station
      charger: { //charger on the station
        type: "SuperCharger",
        numSockets: 1, //number of sockets on the charger
        inUse: false //is the charger in use
      }
    }
  }

};

//Main
//====================

$(document).ready(function () {
  initDb();
  appendProviderInfo();
  providerMap();
  pullUser();

  


  $("#pushUser").on("click", function () {
    $("#user").empty();
    pushUser();
    
  });

  $("#locate").on("click", function () {
    
    gl();
  });

  $("#update-user").on("click", function (snapshot) {
    sendUserInfo();
  });

  $("#update-provider").on("click", function(snapshot) {
    sendUserInfo();
  });

});

//Functions
//==================

function initDb() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC6eAPWuYgz1OEsS8mvrkNfu4XYduyD5aE",
    authDomain: "project1-8e6c3.firebaseapp.com",
    databaseURL: "https://project1-8e6c3.firebaseio.com",
    projectId: "project1-8e6c3",
    storageBucket: "project1-8e6c3.appspot.com",
    messagingSenderId: "853012909302"
  };
  firebase.initializeApp(config);
  database = firebase.database();
}


function providerMap(providerLat, providerLong) {
  // 40.785091, -73.968285));
  providerLat = user.provider.station.marker.lat;
  providerLong = user.provider.station.marker.lng;

  console.log(providerLat);
  console.log(providerLong);
  var providerLoc = { lat: providerLat, lng: providerLong };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: providerLoc

  });
  console.log(providerLat);
  console.log(providerLong);
  var geocoder = new google.maps.Geocoder();
  console.log(geocoder);

  document.getElementById('submit').addEventListener('click', function () {
    geocodeAddress(geocoder, map);
  });

}

function geocodeAddress(geocoder, resultsMap) {
  console.log(geocoder);
  var address = document.getElementById('address').value;

  geocoder.geocode({ 'address': address }, function (results, status) {

    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      console.log(marker.position.lat());
      console.log(marker.position.lng());
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function gl() {

  // Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to
  // locate you.
  var map, infoWindow;

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  {

  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);

  }
}

function pullUser() {
  database.ref().on("child_added", function (snapshot) {
    var data = snapshot.val();
    var newCol = $("<div class='col'>");
    console.log(data);
    var rowName = "<div class='row'>" + data.user.first + " " + data.user.last + "</div> ";
    
    var rowEmail = "<div class='row'>" + data.user.email + "</div> ";
    
    var rowPhone = "<div class='row'>" + data.user.phone + "</div> ";

    var rowAddress = "<div class='row'>" + data.user.address + "</div> ";

    var rowCharger = "<div class='row'>" + data.user.provider.station.charger.type + "</div> ";

    newCol.append(rowName, rowEmail, rowPhone, rowAddress, rowCharger);
    $("#user").append(newCol);

  })
}
function pushUser() {
  // Set data to Firebase
  
  database.ref().push(
    {
      user: user,
      
    })

}

function pushMarker() {
  var myLatLng = { lat: -25.363, lng: 131.044 };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'map'
  });
}
function sendUserInfo() {
  //grab inputs from account info form
  var first = $("#user-firstName").val().trim();
  var last = $("#user-lastName").val().trim();
  var email = $("#user-email").val().trim();
  var phone = $("#user-phone").val().trim();
  
  //send new user values to firebase
  database.ref(user).set({
    first: first,
    last: last,
    email: email,
    phone: phone,
  });
  console.log(first);
  console.log(last);
  console.log(email);
  console.log(phone);
}
//if user is a provider as well, then we need to grab and send more values to firebase
function sendProviderInfo() {
  var first = $("#provider-firstName").val().trim();
  var last = $("#provider-lastName").val().trim();
  var email = $("#provider-email").val().trim();
  var phone = $("#provider-phone").val().trim();
  var providerAddress = $("#provider-address").val().trim();
  var chargerType = $("#provider-type").val().trim();//type of charger

  //send provider info to firebase
  database.ref(user).set({
    first: first,
    last: last,
    email: email,
    phone: phone
  });
  //send charger info to firebase
  database.ref(charger).set({
    type: chargerType
  });

  //send provider address to firebase
  database.ref(provider).set({
    address: providerAddress
  });
}

//append provider info on dash in cards
function appendProviderInfo() {
  database.ref().on("value", function (snapshot) {
    // console.log(snapshot.val());
    // key = snapshot.key;
    // console.log(key);
    
  //grab info from firebase
  // database.ref(user).on("value", function (snapshot) {
  //     var first = snapshot.val().first;
  //     var last = snapshot.val().last;
  //     var address = snapshot.val().address;
  //     var phone = snapshot.val().phone;
  //     var pic = snapshot.val().pic;

  // });
  })
  // console.log("First name: " + first);
  // console.log("Last name: " + last);
  // console.log("Address: " + address);
  // console.log("Phone number: " + phone);

  // database.ref(charger).on("value", function (snapshot) {
  //   var type = snapshot.val().type;
  // });
  // //log charger type
  // console.log("Charger type: " + type);

  // //append info to provider cards
  // $("#card-info").append(user.pic);
  // $("#card-name").text(user.first + " " + user.last);
  // $("#card-phone").text(user.phone);
  // $("#card-address").text(user.address);
  // $("#card-type").text(user.provider.station.charger.type);
};

