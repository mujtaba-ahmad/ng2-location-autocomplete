"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
// import 'rxjs/add/observable/throw';
var GEOLOCATION_ERRORS = {
    'errors.location.unsupportedBrowser': 'Browser does not support location services',
    'errors.location.permissionDenied': 'You have rejected access to your location',
    'errors.location.positionUnavailable': 'Unable to determine your location',
    'errors.location.timeout': 'Service timeout has been reached'
};
var LocationAutocompleteService = (function () {
    /**
     * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
     * @param {Object} [opts] An object literal to specify one or more of the following attributes and desired values:
     *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
     *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
     *              If timeout is Infinity, (the default value) the location request will not time out.
     *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
     *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
     *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
     *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
     *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
     * @returns {Observable} An observable sequence with the geographical location of the device running the client.
     */
    function LocationAutocompleteService(_http) {
        this._http = _http;
        this.url = "https://maps.googleapis.com/maps/api/geocode/json";
        this.googleApiKey = "AIzaSyBv1GDwJ2uP7OFeRVq3Gimn_snohmAVeE0";
        this.geolocation = {
            street_number: '',
            locality: '',
            administrative_area_level_1: '',
            postal_code: '',
            lng: '',
            lat: '',
            formatted_address: ''
        };
        this.componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'long_name',
            country: 'long_name',
            postal_code: 'short_name'
        };
    }
    LocationAutocompleteService.prototype.getBrowserLocation = function (opts) {
        return Observable_1.Observable.create(function (observer) {
            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(function (position) {
                    observer.next(position);
                    observer.complete();
                }, function (error) {
                    switch (error.code) {
                        case 1:
                            observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                            break;
                        case 2:
                            observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                            break;
                        case 3:
                            observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                            break;
                    }
                }, opts);
            }
            else {
                observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
            }
        });
    };
    LocationAutocompleteService.prototype.getLocation = function (data) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('key', this.googleApiKey);
        params.set('latlng', data.coords.latitude + ',' + data.coords.longitude);
        return this._http.get(this.url, { search: params })
            .map(function (response) {
            var place = response.json();
            for (var i = 0; i < place.results[0].address_components.length; i++) {
                var addressType = place.results[0].address_components[i].types[0];
                if (_this.componentForm[addressType]) {
                    var val = place.results[0].address_components[i][_this.componentForm[addressType]];
                    _this.geolocation[addressType] = val;
                }
            }
            _this.geolocation.lat = data.coords.latitude;
            _this.geolocation.lng = data.coords.longitude;
            _this.geolocation.formatted_address = _this.geolocation.locality + ', ' + _this.geolocation.administrative_area_level_1;
            return _this.geolocation;
        })
            .catch(this.handleError);
    };
    LocationAutocompleteService.prototype.handleError = function (error) {
        var errMsg = (error._body) ? JSON.parse(error._body) :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        return Observable_1.Observable.throw(errMsg);
    };
    LocationAutocompleteService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], LocationAutocompleteService);
    return LocationAutocompleteService;
}());
exports.LocationAutocompleteService = LocationAutocompleteService;
//# sourceMappingURL=locationAutocomplete.service.js.map