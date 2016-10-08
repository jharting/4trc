const MIN_RATING_KEY = '4trc:min-rating';
const UNRATED_KEY = '4trc:show-unrated';

module.exports.showUnrated = false;
module.exports.minRating = 70;

function setMap (marker, value) {
    if (marker.getMap() !== value) {
        marker.setMap(value);
    }
}

module.exports.filter = function (markers) {
    markers.forEach(function (marker) {
        if (marker.venue.foursquare && marker.venue.foursquare.rating) {
            const value = Math.floor(marker.venue.foursquare.rating * 10) >= module.exports.minRating;
            setMap(marker.marker, (value) ? map : null);
        } else {
            setMap(marker.marker, (module.exports.showUnrated) ? map : null);
        }
    });
};

module.exports.setMinRating = function (value) {
    module.exports.minRating = value;
    window.localStorage.setItem(MIN_RATING_KEY, value);
    const element = document.getElementById('filter-min-rating-value');
    if (element) {
        document.getElementById('filter-min-rating-value').innerHTML = value;
    }
};

module.exports.setUnrated = function (value) {
    module.exports.showUnrated = value;
    window.localStorage.setItem(UNRATED_KEY, value);
};

function init() {
    const minRating = parseInt(window.localStorage.getItem(MIN_RATING_KEY));
    if (!isNaN(minRating)) {
        module.exports.setMinRating(minRating);
    }
    const unrated = window.localStorage.getItem(UNRATED_KEY) === 'true';
    if (unrated) {
        module.exports.setUnrated(true);
    }
}

init();
