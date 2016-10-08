const handlebars = require('handlebars');
const filters = require('./filters');

function getIcon (venue) {
    if ('foursquare' in venue) {
        if (venue.foursquare.rating) {
            const rating = Math.floor(venue.foursquare.rating * 10);
            return `./icons/rating/${rating}.png`;
        }
        return './icons/rating/no-rating.png';
    }
    return './icons/rating/no-match.png';
}

let infoWindowTemplate = null;

function compileTemplates () {
    const source = document.getElementById('venue-window-template').innerHTML;
    infoWindowTemplate = handlebars.compile(source);
}

module.exports.drawMarker = function (venue, map) {
    if (!infoWindowTemplate) {
        compileTemplates();
    }

    const position = {
        lat: venue.trc.lat,
        lng: venue.trc.lng
    }

    let title = venue.trc.name;
    if (venue.foursquare && venue.foursquare.categories) {
        title +=  `(${venue.foursquare.categories})`;
    }

    const opts = {
        position: position,
        map: map,
        icon: getIcon(venue),
        title: title
    };

    const marker = new google.maps.Marker(opts);
    let infoWindow = null;

    marker.addListener('click', function () {
        if (!infoWindow) {
            infowindow = new google.maps.InfoWindow({
                content: infoWindowTemplate({venue: venue})
            });
        }
        infowindow.open(map, marker);
    });

    return marker;
}

module.exports.drawControls = function (map) {
    const controlDiv = document.createElement('div');
    const filterSource = document.getElementById('filter-control-template').innerHTML;
    const template = handlebars.compile(filterSource);
    const filter = template({
        minRating: filters.minRating,
        checked: filters.showUnrated ? 'checked' : ''
    });

    controlDiv.innerHTML = filter;
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(controlDiv);
}
