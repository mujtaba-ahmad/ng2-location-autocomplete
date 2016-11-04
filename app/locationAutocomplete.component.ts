import { Component, Input, OnInit, ElementRef, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { LocationAutocompleteService } from './locationAutocomplete.service';
declare var google:any;
@Component({
  selector: 'location-autocomplete',
  template: `<input id="autocomplete-dropdown" type="text" class={{classes}} placeholder={{placeholder}} name={{name}} [(ngModel)]="address" (ngModelChange)="changeLocation($event)" />`,
  providers: [LocationAutocompleteService]
})
export class LocationAutocompleteComponent implements OnInit, AfterViewInit {
    @Input() classes: string;
    @Input() placeholder: string;
    @Input() name: string;
    @Input() offset: number;
    @Input() currentLocation: boolean;
    @Output() getAddress = new EventEmitter();
    private address: string;
    private addressFormat = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    private responseData: any = {
        street_number: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
        lng: '',
        lat: '',
        formatted_address: ''
    }
    private input: HTMLElement
    private autocomplete :any;
    constructor(private el: ElementRef, private _LocationAutocompleteService: LocationAutocompleteService) {
    }

    changeLocation($event) {
        if(this.address.length > this.offset) {
            this.autocomplete = new google.maps.places.Autocomplete(this.input);
            google.maps.event.addListener(this.autocomplete, 'place_changed', ()=> {
                var place = this.autocomplete.getPlace();
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (this.addressFormat[addressType]) {
                    var val = place.address_components[i][this.addressFormat[addressType]];
                    // document.getElementById(addressType).value = val;
                    this.responseData[addressType] = val;
                    }
                }
                var location = place['geometry']['location'];
                this.responseData.lat =  location.lat();
                this.responseData.lng = location.lng();
                this.responseData.formatted_address = place.formatted_address;
                this.getAddress.next(this.responseData);
            });
        }
    }
    ngOnInit(): void {
        console.log(this.classes)
        console.log(this.placeholder)
        console.log(this.name)
        console.log(this.offset)
        var opts: any = {
            enableHighAccuracy: true,
            timeout: "Infinity",
            maximumAge: "Infinity"
        }
        this._LocationAutocompleteService.getBrowserLocation(opts)
            .subscribe(
                res => {
                    console.log(res);
                    this._LocationAutocompleteService.getLocation(res)
                        .subscribe(
                            data => {
                                console.log(data)
                                this.responseData = data;
                                this.address = this.responseData.formatted_address;
                                this.getAddress.next(this.responseData);
                            }
                        )
                }
            )
    }
    ngAfterViewInit() {
        this.input = this.el.nativeElement.children[0];
    }
}
