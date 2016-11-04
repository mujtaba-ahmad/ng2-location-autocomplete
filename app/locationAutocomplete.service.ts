import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

const GEOLOCATION_ERRORS = {
	'errors.location.unsupportedBrowser': 'Browser does not support location services',
	'errors.location.permissionDenied': 'You have rejected access to your location',
	'errors.location.positionUnavailable': 'Unable to determine your location',
	'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class LocationAutocompleteService {
    private url: string = "https://maps.googleapis.com/maps/api/geocode/json";
    public googleApiKey: string = "AIzaSyBv1GDwJ2uP7OFeRVq3Gimn_snohmAVeE0";
	private geolocation: any = {
		street_number: '',
		locality: '',
		administrative_area_level_1: '',
		postal_code: '',
		lng: '',
		lat: '',
		formatted_address: ''
	}
	private componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
  	};
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

	constructor(private _http: Http) {}
	public getBrowserLocation(opts: any): Observable<any> {

		return Observable.create((observer: Observer<any>) => {

			if (window.navigator && window.navigator.geolocation) {
				window.navigator.geolocation.getCurrentPosition(
					(position) => {
						observer.next(position);
            			observer.complete();
					},
					(error) => {
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
					},
					opts);
			}
			else {
				observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
			}

		});
	}
	public getLocation(data: any) {
		let params = new URLSearchParams();
        params.set('key', this.googleApiKey);
        params.set('latlng', data.coords.latitude + ',' + data.coords.longitude);
        return this._http.get(this.url, {search : params})
            .map((response: Response) =>  {
				var place = <any>response.json();
				for (var i = 0; i < place.results[0].address_components.length; i++) {
					var addressType = place.results[0].address_components[i].types[0];
					if (this.componentForm[addressType]) {
						var val = place.results[0].address_components[i][this.componentForm[addressType]];
						this.geolocation[addressType] = val;
					}
				}
				this.geolocation.lat = data.coords.latitude;
				this.geolocation.lng = data.coords.longitude;
				this.geolocation.formatted_address = this.geolocation.locality + ', ' + this.geolocation.administrative_area_level_1;
                return this.geolocation;
            })
            //.do(data => console.log("All: " +  JSON.stringify(data)))
            .catch(this.handleError);
	}
	private handleError (error: any) {
        let errMsg = (error._body) ? JSON.parse(error._body) :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}

