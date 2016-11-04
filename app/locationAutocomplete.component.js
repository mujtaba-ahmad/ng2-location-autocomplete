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
var locationAutocomplete_service_1 = require('./locationAutocomplete.service');
var LocationAutocompleteComponent = (function () {
    function LocationAutocompleteComponent(el, _LocationAutocompleteService) {
        this.el = el;
        this._LocationAutocompleteService = _LocationAutocompleteService;
        this.getAddress = new core_1.EventEmitter();
        this.addressFormat = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'long_name',
            country: 'long_name',
            postal_code: 'short_name'
        };
        this.responseData = {
            street_number: '',
            locality: '',
            administrative_area_level_1: '',
            postal_code: '',
            lng: '',
            lat: '',
            formatted_address: ''
        };
    }
    LocationAutocompleteComponent.prototype.changeLocation = function ($event) {
        var _this = this;
        if (this.address.length > this.offset) {
            this.autocomplete = new google.maps.places.Autocomplete(this.input);
            google.maps.event.addListener(this.autocomplete, 'place_changed', function () {
                var place = _this.autocomplete.getPlace();
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (_this.addressFormat[addressType]) {
                        var val = place.address_components[i][_this.addressFormat[addressType]];
                        // document.getElementById(addressType).value = val;
                        _this.responseData[addressType] = val;
                    }
                }
                var location = place['geometry']['location'];
                _this.responseData.lat = location.lat();
                _this.responseData.lng = location.lng();
                _this.responseData.formatted_address = place.formatted_address;
                _this.getAddress.next(_this.responseData);
            });
        }
    };
    LocationAutocompleteComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log(this.classes);
        console.log(this.placeholder);
        console.log(this.name);
        console.log(this.offset);
        var opts = {
            enableHighAccuracy: true,
            timeout: "Infinity",
            maximumAge: "Infinity"
        };
        this._LocationAutocompleteService.getBrowserLocation(opts)
            .subscribe(function (res) {
            console.log(res);
            _this._LocationAutocompleteService.getLocation(res)
                .subscribe(function (data) {
                console.log(data);
                _this.responseData = data;
                _this.address = _this.responseData.formatted_address;
                _this.getAddress.next(_this.responseData);
            });
        });
    };
    LocationAutocompleteComponent.prototype.ngAfterViewInit = function () {
        this.input = this.el.nativeElement.children[0];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LocationAutocompleteComponent.prototype, "classes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LocationAutocompleteComponent.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LocationAutocompleteComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], LocationAutocompleteComponent.prototype, "offset", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], LocationAutocompleteComponent.prototype, "currentLocation", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LocationAutocompleteComponent.prototype, "getAddress", void 0);
    LocationAutocompleteComponent = __decorate([
        core_1.Component({
            selector: 'location-autocomplete',
            template: "<input id=\"autocomplete-dropdown\" type=\"text\" class={{classes}} placeholder={{placeholder}} name={{name}} [(ngModel)]=\"address\" (ngModelChange)=\"changeLocation($event)\" />",
            providers: [locationAutocomplete_service_1.LocationAutocompleteService]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, locationAutocomplete_service_1.LocationAutocompleteService])
    ], LocationAutocompleteComponent);
    return LocationAutocompleteComponent;
}());
exports.LocationAutocompleteComponent = LocationAutocompleteComponent;
//# sourceMappingURL=locationAutocomplete.component.js.map