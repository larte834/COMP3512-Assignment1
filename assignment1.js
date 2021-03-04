document.addEventListener("DOMContentLoaded", function () {

    // set DOMS
    const headerBox = document.querySelector('div.a');
    const listBox = document.querySelector('div.b');
    const companyInfoBox = document.querySelector('div.c');
    const ammBox = document.querySelector('div.d');
    const mapBox = document.querySelector('div.e');
    const stockBox = document.querySelector('div.f');


    //set header text
    const title = document.createElement('label');
    title.textContent = "COMP 3512 Assign1";
    headerBox.appendChild(title);

    const section = document.createElement('section');
    headerBox.appendChild(section);

    headerBox.addEventListener('mouseenter', (e) => {
        section.style.display = "grid";
        //create elements to be displayed
        const credits = document.createElement('label');
        const name = document.createElement('label');
        const course = document.createElement('label');
        const party = document.createElement('label');

        //create text content
        credits.textContent = "Credits:"
        name.textContent = "Randy Lam & Lidiya Artemenko";
        course.textContent = "Comp 3512";
        party.textContent = "";

        //append labels to the div
        section.appendChild(credits);
        section.appendChild(name);
        section.appendChild(course);
        section.appendChild(party);


        //hide header info after 5 sec
        setTimeout(function () {
            section.style.display = "none";
        }, 5000);
    })

    const url1 = 'http://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
    const url2 = 'http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=xxx';

    const animation = document.querySelector('.animate');
    const coList = [];


    // check for local storage, not doesn't exist then fetch
   // let listOfCompanies = localStorage.getItem('listOfCompanies');
   // if (!listOfCompanies) {
        fetch(url1)
            .then(response => {
                if (response.ok) { return response.json() }
                else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
            })
            .then(data => {
                animation.style.display = 'none';
                // save local storage
                let json = JSON.stringify(data);
                //localStorage.setItem('listOfCompanies');
                displayList(data);
                coList.push(...data);
              //  localStorage.setItem('listOfCompanies', json);
                // const goButton = document.createElement('button');
                // const clearButton = document.createElement('button');
                // goButton.setAttribute('id', 'goButton');
                // goButton.textContent = "GO";
                // clearButton.setAttribute('id', 'clearButton');
                // clearButton.textContent = "CLEAR";
                // companyList.appendChild(goButton);
                // companyList.appendChild(clearButton);
            })
            .catch(err => console.log(err));
    //}

    function displayList(data) {
        const list = document.createElement('ul');
        listBox.appendChild(list);
        //displaying list of companies
        for (let d of data) {
            const companyName = document.createElement('li');
            companyName.textContent = d.name;
            list.appendChild(companyName);
            companyName.addEventListener('click', (e) => {
                console.log('clicked');
            });
        }
    }

    const searchBox = document.querySelector('.search');
    const suggestions = document.querySelector('#filterList');
    searchBox.addEventListener('keyup', displayMatches);

    function displayMatches() {
            const matches = findMatches(this.value, coList);

            suggestions.innerHTML = "";

            matches.forEach(m => {
                var option = document.createElement('option');
                option.textContent = m.name+", "+m.symbol;
                suggestions.appendChild(option);
            });
            // companyName.addEventListener('change', displayCompanyInfo(d));
    }

    function findMatches(wordToMatch, coList) {
        return coList.filter(obj => {
            const regex = new RegExp(wordToMatch, 'gi');
            return obj.symbol.match(regex);
        });
    }

    function displayCompanyInfo (data) {
        companyInfoBox.style.display = "grid";
        // const h2 = document.createElement('h2');
        // h2.textContent = "Company Information";
        // companyInfoBox.appendChild(h2);
        // // const logo = document.createElement('img');
        // // logo.setAttribute('src', data.);
        const symbol = document.createElement('span');
        //document.querySelector("#galleryCity").textContent = galleries.location.city;
        document.querySelector("symbol").textContent = data.symbol;
        // const sector = document.createElement('div');
        // sector.textContent = data.sector;
        // const subIndustry = document.createElement('div');
        // subIndustry.textContent = data.subindustry;
        // const address = document.createElement('div');
        // address.textContent = data.address;
        // const website = document.createElement('div');
        // const companyURL = document.createElement('a');
        // website.appendChild(companyURL);
        // const exchange = document.createElement('div');
        // const description = document.createElement('div');
    }

    // document.querySelector("#galleryName").textContent = galleries.nameEn;
    //     document.querySelector("#galleryCity").textContent = galleries.location.city;
    //     document.querySelector("#galleryNative").textContent = galleries.nameNative;;
    //     document.querySelector("#galleryAddress").textContent = galleries.location.address;
    //     document.querySelector("#galleryCountry").textContent = galleries.location.country;
    //     document.querySelector("#galleryHome").href = galleries.link;
    //     document.querySelector("#galleryHome").textContent = galleries.link;

    // function displayMap (latitude, longitude) {
    //     mapBox.style.height = '600px';
    //     map = new google.maps.Map(mapBox, {
    //         center: {lat:latitude, lng: longitude}, zoom: 6
    //     });
    // }

});