function initMap() {
			
	    var map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {lat: 53.889, lng: -6.6001},
            zoom: 10
        });
	    /***********************************************************************************/
		var x = document.getElementById("map");
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else { 
				x.innerHTML = "Geolocation is not supported by this browser.";//changed
			}
			var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
 
			function showPosition(position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				latlon = new google.maps.LatLng(lat, lon)
				map = document.getElementById('map')

				var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
				}
				
				var map = new google.maps.Map(document.getElementById("map"), myOptions);
				var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
	
			    var origin_place_id = null;
				var destination_place_id = null;
				var travel_mode = 'WALKING';

				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;
				directionsDisplay.setMap(map);

				var origin_input = document.getElementById('origin-input');
				var destination_input = document.getElementById('destination-input');
				var modes = document.getElementById('mode-selector');

				map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

				var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
				origin_autocomplete.bindTo('bounds', map);
				var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
				destination_autocomplete.bindTo('bounds', map);

				// Sets a listener on a radio button to change the filter type on Places
				// Autocomplete.
				function setupClickListener(id, mode) {
				    var radioButton = document.getElementById(id);
				    radioButton.addEventListener('click', function() {
					travel_mode = mode;
				    });
				}
				setupClickListener('changemode-walking', 'WALKING');
				setupClickListener('changemode-transit', 'TRANSIT');
				setupClickListener('changemode-driving', 'DRIVING');

				function expandViewportToFitPlace(map, place) {
				    if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport);
				    } else {
						map.setCenter(place.geometry.location);
						map.setZoom(17);
					}
				}

				origin_autocomplete.addListener('place_changed', function() {
				    var place = origin_autocomplete.getPlace();
				    if (!place.geometry) {
						window.alert("Autocomplete's returned place contains no geometry");
						return;
					}
				    expandViewportToFitPlace(map, place);

				    // If the place has a geometry, store its place ID and route if we have
				    // the other place ID
				    origin_place_id = place.place_id;
				    route(origin_place_id, destination_place_id, travel_mode,
				    directionsService, directionsDisplay);
				});

				destination_autocomplete.addListener('place_changed', function() {
				    var place = destination_autocomplete.getPlace();
				    if (!place.geometry) {
						window.alert("Autocomplete's returned place contains no geometry");
						return;
				    }
				    expandViewportToFitPlace(map, place);

				    // If the place has a geometry, store its place ID and route if we have
				    // the other place ID
				    destination_place_id = place.place_id;
				    route(origin_place_id, destination_place_id, travel_mode,directionsService, directionsDisplay);
				});

				function route(origin_place_id, destination_place_id, travel_mode,
							   directionsService, directionsDisplay) {
				    if (!origin_place_id || !destination_place_id) {
					    return;
				    }
				    directionsService.route({
						origin: {'placeId': origin_place_id},
						destination: {'placeId': destination_place_id},
						travelMode: travel_mode
				    }, 
					function(response, status) {
						if (status === 'OK') {
					    directionsDisplay.setDirections(response);
						} else {
							window.alert('Directions request failed due to ' + status);
						}
				    });
				}
			}
			  
			function handleLocationError(browserHasGeolocation, infoWindow, pos) {
				infoWindow.setPosition(pos);
				infoWindow.setContent(browserHasGeolocation ?
				'Error: The Geolocation service failed.' :
				'Error: Your browser doesn\'t support geolocation.');
			}
	}
	function myFunction() {
			location.reload();
		}