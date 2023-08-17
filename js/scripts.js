/* Instantiate global variables */
const touchLayer = document.getElementById('touch-layer');
const textLayer = document.getElementById('text-layer');
const headerSection = document.getElementById('header-section')
const baseLayer = document.getElementById('base-layer')
const splashSection = document.getElementById('splash-section');
const infoSection = document.getElementById('info-section');
const profileSection = document.getElementById('profile-section');
const ethelSection = document.getElementById('ethel-section');
const main = document.getElementById('main');
const walkDetails = document.getElementById('walk-detail');
const footerSection = document.getElementById('footer-section')
const listDetails = document.getElementById('list-detail');
const filterSection = document.getElementById('filter-section');
const listSection = document.getElementById('list-section');
const detailSection = document.getElementById('details-section');
const filterIcon = document.getElementById('filter-icon');
const distanceInput = document.getElementById('distance-input');
const distanceValue = document.getElementById('distance-value');
const ascentInput =  document.getElementById('ascent-input');
const ascentValue = document.getElementById('ascent-value');
const filterButton = document.getElementById('filter-button');
const areaInput =  document.getElementById('area');
const gradeInput =  document.getElementById('grade');
const clearFilter = document.getElementById('clear-filter');
const shuffleWalks = document.getElementById('shuffle-walks');
const apiKey = 'NC61maqo1GjANClmLlwWpNOotJS8Ej9P';
const serviceUrl = 'https://api.os.uk/maps/raster/v1/wmts';
const parser = new ol.format.WMTSCapabilities();
let walks = new Array();
let counter = 0;
let filtered = false;
let filter = false;
let home = false;
let reload = false;


main.addEventListener('mousemove', preventDragEvent);

shuffleWalks.addEventListener('click', function() {
    Promise.resolve(sortData(walks))
    .then(() => display());
});

clearFilter.addEventListener('click', function(){
    filterIcon.style.display = 'block';
    shuffleWalks.style.display = 'block';
    clearFilter.style.display = 'none';
    filterButton.style.display = 'none';
    document.getElementById('list-heading').innerHTML = "Full Walk List";
    getData();
});

function preventDragEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

// Setup the EPSG:27700 (British National Grid) projection for OS Mapping
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps" +
    "=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");
ol.proj.proj4.register(proj4);

/* Add event listener used on loading */
window.addEventListener('load', loadMain);



/* Function to read data from a json */
function getData() {
    "use strict";
    fetch("data/walks.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            walks = data;
        })
        .then(() => sortData(walks))
        .then(() => display(walks));    
} 
/* Function to display the list of walks with optional filter */
function loadMain() {
    if (document.getElementById("myTopnav").className !== "topnav") {
        menuFunction();
    }
    if(home !==true){
        home = true;
        main.style.display = 'block';
        listSection.style.display = 'block';
        footerSection.style.display = 'block';
        filterIcon.style.display = 'block';
        shuffleWalks.style.display = 'block';
        filterButton.style.display = 'none';
        document.getElementById('list-heading').innerHTML = "Full Walk List";
        [splashSection,filterSection, detailSection, infoSection, ethelSection, profileSection].forEach((item) =>  {
            item.style.display ='none'
        });
        if (filtered || reload) {
            filtered = false;
            reload = false;
            clearFilter.style.display = 'none';
            getData();
        }
        else {
            display();
        }
    }    
}
/* Load ethel Page */
function loadEthel() {
    if(ethelSection.style.display === "none"){
        menuFunction();
        home = false;
        ethelSection.style.display = 'block';
        [splashSection,filterSection, listSection, detailSection, infoSection, profileSection, filterIcon, shuffleWalks, clearFilter].forEach((item) =>  {
            item.style.display ='none'
        });
    }
}
/* Load Information Page */
function loadInformation() {
    if(infoSection.style.display === "none"){
        menuFunction();
        home = false;
        infoSection.style.display = 'block';
        [splashSection,filterSection, listSection, detailSection, ethelSection, profileSection, filterIcon, shuffleWalks, clearFilter].forEach((item) =>  {
            item.style.display ='none'
        });
    }
}
/* Load Profile Page */
function loadProfile() {
    if(profileSection.style.display === "none"){
        menuFunction();
        home = false;
        profileSection.style.display = 'block';
        [splashSection,filterSection, listSection, detailSection, infoSection, ethelSection, filterIcon, shuffleWalks, clearFilter].forEach((item) =>  {
            item.style.display ='none'
        });
    }    
}   

/* Function to randomly sort data so order changes each time it is loaded */
function sortData(unsorted) {
    //console.log("sd", unsorted);
    walks = unsorted
        .map(value => ({
        value,
        sort: Math.random()
        }))
        .sort((a, b) => a.sort - b.sort)
        .map(({
            value
        }) => value);
       return walks;
   
}



/* Function to display the walk list*/
function display() {
    //console.log("display", walks);
    counter = 0;
    listDetails.innerHTML ='';
    for (counter in walks) {
        listDetails.innerHTML = listDetails.innerHTML + '<span><article id=' + walks[counter].ref +' class="image">' +
            '<img src=data/' + walks[counter].ref + '/' +
            'picture.png alt=' + '"' + walks[counter].name + '"' +
            '><p class="name" ' +
            '>' + walks[counter].name + '</p>' +
            '<table class="walk-table">' +
            '<tbody>' +
            '<span><tr>' +
            '<th>Distance:</th>' +
            '<th>Grade:</th>' +
            '<th>Ascent:</th>' +
            '<th>Area:</th>' +
            '</tr>' +
            '<tr>' +
            '<td>' + walks[counter].distance + ' miles</td>' +
            '<td>' + walks[counter].grade + '</td>' +
            '<td>' + walks[counter].ascent + ' m</td>' +
            '<td>' + walks[counter].area + ' Peak</td>' +
            '</tr></span></tbody></table>' +
            '</article></span>';
            counter++;
    }
            /* This adds colour coded border dependng on grade of walk */
            counter = 0;
            for (counter in walks) { 
                let walk = document.getElementById(walks[counter].ref);
                walk.addEventListener("click", function() {details(this.id)});
                switch (walks[counter].grade) {
                    case "EASY":
                        walk.style.borderColor = "Green";
                        break;
                    case "MODERATE":
                        walk.style.borderColor = "Blue";
                        break;
                    case "HARD":
                        walk.style.borderColor = "Red";
                        break;
                    case "EXTREME":
                        walk.style.borderColor = "Black";
                        break;
                    default:
                        walk.style.borderColor = "Blue";
                }  
                counter++;  
            }
}  
/* Function to display the individual walk details*/
function details(value) {
    [splashSection,filterSection, listSection, infoSection, ethelSection, filterIcon, shuffleWalks, clearFilter].forEach((item) =>  {
        item.style.display ='none';
    });
    detailSection.style.display ='block';
    home = false;
    const index = getIndex(value);
    const latlng = walks[index].latlon;
    const lat = eval(latlng.split(",")[0]);
    const lng = eval(latlng.split(",")[1]);
    const eNs = walks[index].eastingsnorthings;
    const eastings = eval(eNs.split(",")[0]);
    const northings = eval(eNs.split(",")[1]);
    walkDetails.innerHTML =
        '<h2>' + walks[index].name + ' - ' + walks[index].distance + ' miles' + '</h2>' +
        '<div id="legend"><p>Border = Grade  |  Scroll = Zoom  |  Purple = Walk Route</p></div>' +
        '<div id="os-map" height=400 width=80%></div>' +
        '<h3>Walk Description</h3>' + 
        '<div class="line"></div>' +
        '<p class="description">' +
        walks[index].text + '</p>' +
        '<img id="details-image" src=data/' + walks[index].ref + '/' +
        'picture.png alt=' + walks[index].name +
        '>' +
        '<h3>Park / Meet Details</h3>' + 
        '<div class="line"></div>' +
        '<div id = "meet-details">' +
        '<p class="description">' + walks[index].meet + '</p>' + 
        '<div id="google-map"></div>'+
        '<h3>Walk Information</h3>' + 
        '<div class="line"></div>' +
        '<div id = "info-details">'+
        '<table id="details-table">' +
        '<tbody>' +
        '<tr>' +
        '<td>Distance:</td>' +
        '<td>' + walks[index].distance + ' miles</td>' +
        '<td>Postcode:</td>' +
        '<td>' + walks[index].postcode + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Ascent:</td>' +
        '<td>' + walks[index].ascent + ' metres</td>' +
        '<td>What3Words:</td>' +
        '<td>' + walks[index].what3words + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Area:</td>' +
        '<td>' + walks[index].area + ' Peak</td>' +
        '<td>Grid Reference:</td>' +
        '<td>' + walks[index].gridref + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Grade:</td>' +
        '<td>' + walks[index].grade + '</td>' +
        '<td>Lat / Lon:</td>' +
        '<td>' + walks[index].latlon + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

        
    
    initOSMap(eastings, northings, walks[index].ref, walks[index].grade);
    mapInit(lat, lng);
}
/* Function to determine the array position of the individual walk to display*/
function getIndex(ref) {
    counter = 0;
    for (counter in walks) {
        if (ref === walks[counter].ref) {
            return counter;
        }
        counter++;
    }
}
/* Google map loader from co-ordinates in json*/
function mapInit(lat, lng) {

    // The location required
    const location = {
        lat: lat,
        lng: lng
    }; //e.g. 53.432953 , -1.8687671
    // The map, centered at location
    const map = new google.maps.Map(document.getElementById("google-map"), {
        zoom: 15,
        center: location,
    });
    // The marker, positioned at location
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
}
/* OS Map from co-ordinates in json and GPX track */
function initOSMap(lon, lat, ref, grade) {
    const osMap = document.getElementById("os-map");
    fetch(serviceUrl + '?key=' + apiKey + '&service=WMTS&request=GetCapabilities&version=2.0.0')
        .then(response => response.text())
        .then(text => {
            const result = parser.read(text);
            const options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'Leisure_27700',
                matrixSet: 'EPSG:27700'
            });
            /* Specify GPX Layer*/
            const gpxLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: "../data/" + ref + "/map.gpx",
                    format: new ol.format.GPX()
                }),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'purple',
                        width: 4
                    })
                })
            });
            /* Instantiate the map source*/
            const source = new ol.source.WMTS(options);
            const tileLayer = new ol.layer.Tile({
                source: source
            });
            // Initialize the map object.
            let map = new ol.Map({
                layers: [tileLayer, gpxLayer],
                target: osMap,
                view: new ol.View({
                    projection: options.projection,
                    resolutions: options.tileGrid.getResolutions(),
                    zoom: 6,
                    minZoom: 6,
                    maxZoom: 9,
                    center: [lon, lat]
                }),
            });
        });
        switch (grade) {
            case "EASY":
                osMap.style.borderColor = "Green";
                break;
            case "MODERATE":
                osMap.style.borderColor = "Blue";
                break;
            case "HARD":
                osMap.style.borderColor = "Red";
                break;
            case "EXTREME":
                osMap.style.borderColor = "Black";
                break;
            default:
                osMap.style.borderColor = "Blue";
        }  
}
/* Function to get Min/Max Slider values for Ascent and Distance */
function getMinMax() {
    let index = 0;
    let temp = [];
    let typeNo = [1, 2];
    let minDistance = 0
    let maxDistance = 0
    let minAscent = 0
    let maxAscent = 0
    typeNo.forEach(function(value) {
            walks.forEach(function(){
                if(value===1) {
                    temp.push(parseInt(walks[index].distance));
                }
                else {
                    temp.push(parseInt(walks[index].ascent));  
                }
                index ++;
                })
                index = 0;
        if(value===1) {
            minDistance = Math.min(...temp);
            maxDistance = Math.max(...temp);
        }
        else {
            minAscent = Math.min(...temp);
            maxAscent = Math.max(...temp);
        }
})   
        return [minDistance, maxDistance, minAscent, maxAscent];
}
/* Used to set the filter option on or off on the walk listing page */
function setFilterOn() {
        if(document.getElementById('list-heading').innerHTML !== "Select Filter") {
            const minMax = getMinMax();
            distanceInput.min = minMax[0];
            distanceInput.max = minMax[1];
            distanceInput.value = distanceInput.max;
            distanceValue.innerHTML = distanceInput.value + " miles";
            ascentInput.min = minMax[2];
            ascentInput.max = minMax[3];
            areaInput.value = 'Both';
            gradeInput.value = 'All';
            ascentInput.value = ascentInput.max;
            ascentValue.innerHTML = ascentInput.value + " metres";
            filterSection.style.display = 'flex';
            filterButton.style.display = 'block';
            document.getElementById('list-heading').innerHTML = "Select Filter";
        }
        else {
            filterSection.style.display = 'none';
            filterButton.style.display = 'none';
            document.getElementById('list-heading').innerHTML = "Full Cohort List";
        }
}
/* Activates and closes selected filter parameters */
filterButton.addEventListener('click', function() {
    const distance = distanceInput.value;
    const ascent = ascentInput.value;
    const area = areaInput.value;
    const grade = gradeInput.value.toUpperCase();
    applyFilter(walks, distance, ascent, area, grade)
    filterButton.style.display = 'none';
    filterSection.style.display = 'none';
    clearFilter.style.display = 'inline';
    document.getElementById('list-heading').innerHTML = 'Selected Walks';
    filterIcon.style.display = 'none';
    shuffleWalks.style.display = 'none';
    filtered = true;
});
/* Listener to update visible distance value */
distanceInput.addEventListener('change', function(){
    distanceValue.innerHTML = this.value + "miles";
   
});
/* Listener to update visible ascent value */
ascentInput.addEventListener('change', function(){
    ascentValue.innerHTML = this.value + "metres";
   
});
/* Filter based on Overall walk distance */
function filterDistance(data, distance) {
    const max = distanceInput.max;
      if(distance<max){
        walks = data.filter(item => item.distance <= distance);
       }
       return walks;
}
/* Filter based on Accumulated  Ascent */
function filterAscent(data, ascent) {
    const max = ascentInput.max;
    if(ascent<max){
      walks = data.filter(item => item.ascent <= ascent);
    }
    return walks;
}
/* Filter based on whether White or Dark Peak */
function filterArea(data, area) {
    if(area!=="Both"){
    walks = data.filter(item => item.area == area);
    }
return walks;
}
/* Filter based on grade of walk */
function filterGrade(data, grade) {
    if(grade!=="ALL"){
      walks = data.filter(item => item.grade == grade)
    }
    return walks;
}

/* Chained promises to cascade filter across the dataset */
function applyFilter(data, distance, ascent, area, grade) {
    Promise.resolve(filterDistance(data, distance))
        .catch ((e) => console.log(e))
        .then((walks) => filterAscent(walks, ascent))
        .then((walks) => filterArea(walks, area))
        .then((walks) => filterGrade(walks, grade))
        .then((walks) => display(walks));
}
/* Needed to provide a blank callback when loading google maps api */
function blank() {
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function menuFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  } 

  