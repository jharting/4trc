const venues = require('./data/data.json');
const handlebars = require('handlebars');
const components = require('./lib/components');
const filters = require('./lib/filters');

const prg = {lat: 50.0885313, lng: 14.4286162};

window.init = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: prg,
        zoom: 15,
        disableDefaultUI: false,
        streetViewControl: true
    });

    new klokantech.GeolocationControl(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function () {});
    }

    draw();
    components.drawControls(map);
}

let markers = [];

function draw () {
    markers = venues.map(function (venue) {
        const marker = components.drawMarker(venue, map);
        return {
            venue: venue,
            marker: marker
        }
    });
    filters.filter(markers);
}

window.filterMinRating = function (value) {
    filters.setMinRating(value);
    filters.filter(markers);
}

window.filterUnrated = function (value) {
    filters.setUnrated(value);
    filters.filter(markers);
}

window.filterToggle = function () {
    const element = document.getElementById('filters');
    element.className = (element.className === 'open') ? 'closed' : 'open';
}
