# ng2-location-autocomplete

# Angular 2 Location Autocomplete
Angular 2 Location Autocomplete is compatible with latest release of Angular 2.X.X for location autocomplete dropdoen and to get browser current location using google maps places.


## Usage
Follow these steps:

```js
map: {
      //...
      'ng2-location-autocomplete': 'npm:ng2-location-autocomplete'
     }
```
-and in packages:

```js
packages: {
      //...
      'ng2-location-autocomplete': {
        main: './index.js',
        defaultExtension: 'js'
      }
```

### 2. Update the index.html
- Import script into your index.html.

```html
<script src="https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
```

### 3. Your Component:
- Add following tag in template of your component where you intend to use . 

```ts
<location-autocomplete> </location-autocomplete>
```

- Select attribute name -> `name` attribute of you input field.
- Select attribute placeholder -> `placeholder` attribute of you input field.
- Select attribute classes -> `classes` attribute of you input field.
- Select attribute Offset -> Limit of characters from which you want to start searching for location. (integer value)
- Select attribute currentLocation -> Wather you want to show your current location in field.

- Assign them as shown below:

```ts
<location-autocomplete [name]="'address'" [placeholder]="'Search Location'" [classes]="field location-field" [offset]="3" (getAddress)="getAddress($event)" [currentLocation]="'true'"> </location-autocomplete>
```


### 4. Import the `modules`, `Components` and `services`
Import Components in the NgModule of your application as shown below:

```ts
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }   from './app.component';
import { HttpModule }  from '@angular/http';
import { LocationAutocompleteComponent } from 'ng2-location-autocomplete/index';
@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule ],
  declarations: [ AppComponent, LocationAutocompleteComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
```

### 5 Use `LocationAutocompleteComponent` in your application

```ts
import { Component } from '@angular/core';
import { LocationAutocompleteComponent } from 'ng2-location-autocomplete/index';

@Component({
  selector: 'my-app',
  template: `<h1>My First Angular App</h1>
            <location-autocomplete [name]="'address'" [placeholder]="'Search Location'" classes="field location-field" [offset]="3" (getAddress)="getAddress($event)" [currentLocation]="'true'"> </location-autocomplete>
            `
})
export class AppComponent { 
  getAddress(data) {
    console.log(data);
  }
}
```
getAddress(data) function will return selected address, or if `currentLocation` is set to true, It will return current address initially.


### 6 Use `LocationAutocompleteService` in your application
-To get current location in you Component separately you could use this service separately.

```ts
import { Component } from '@angular/core';
import { LocationAutocompleteService } from 'ng2-location-autocomplete/index';

@Component({
  selector: 'my-app',
  template: `<h1>My First Angular App</h1>`
  providers: [LocationAutocompleteService]
})

export class AppComponent implements OnInit{
    private address: any = {
        street_number: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
        lng: '',
        lat: '',
        formatted_address: ''
    }
    constructor(private _LocationAutocompleteService: LocationAutocompleteService) {}
    ngOnInit(): void {
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

}
```