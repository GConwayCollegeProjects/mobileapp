const listDetail = document.getElementById('list-detail');
document.addEventListener('load', fetchCohorts);
let cohorts = array;



function fetchCohorts() {
    const url = '/php/cohorts.php';
    let oData = new FormData();
    oData.append('submit', 'submit');
    oData.append('source', 'type');
    oData.append('value', 'all');
    fetch(url, {
      "method": "POST",
      "body": oData,
     })
     .then((res) => {
        return res.json();
    })
    .then((data) => {
        cohorts = data;
    })
    //.then(() => sortData(cohorts))
    .then(() => display(cohorts));   
    }



    function display() {
        counter = 0;
        listDetails.innerHTML ='';
        for (counter in cohorts) {
            listDetails.innerHTML = listDetails.innerHTML + '<span><article id=' + cohorts[counter].ref +' class="image">' +
                '<img src=images/meals02.png' + 
                ' alt=' + '"' + cohorts[counter].name + '"' +
                '><p class="name" ' +
                '>' + cohorts[counter].name + '</p>' +
                '<table class="cohort-table">' +
                '<tbody>' +
                '<span><tr>' +
                '<th>Start:</th>' +
                '<th>End:</th>' +
                '</tr>' +
                '<tr>' +
                '<td>' + cohorts[counter].start + ' miles</td>' +
                '<td>' + cohorts[counter].end + '</td>' +
                '</tr></span></tbody></table>' +
                '</article></span>';
                counter++;
        }
               
    }  