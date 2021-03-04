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

    headerBox.addEventListener('mouseover', (e) => {
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

    const url1 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
    const url2 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=xxx';

    const animation = document.querySelector('.animate');
    const companyList = document.querySelector('#filterList');
    const coList = [];


    // check for local storage, not doesn't exist then fetch
    let listOfCompanies = localStorage.getItem('listOfCompanies');
    if (!listOfCompanies) {
        animation.style.display = "flex";
        console.log('1');
        fetch(url1)
            .then(response => {
                animation.style.display = 'none';
                console.log('2');
                if (response.ok) { return response.json() }
                else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
            })
            .then(data => {
                // save local storage
                let json = JSON.stringify(data);
                localStorage.setItem('listOfCompanies', json);
                console.log('3');
            })
            .catch(err => console.log(err));
    }


    // create buttons for list 
    const goButton = document.createElement('button');
    const clearButton = document.createElement('button');
    goButton.setAttribute('id', 'goButton');
    goButton.textContent = "GO";
    clearButton.setAttribute('id', 'clearButton');
    clearButton.textContent = "CLEAR";
    listBox.appendChild(goButton);
    listBox.appendChild(clearButton);

    parsedCompanyList= JSON.parse(listOfCompanies);
    displayList(parsedCompanyList);

    function displayList(data) {
        const list = document.createElement('ul');
        list.setAttribute('id', 'ul1');
        listBox.appendChild(list);
        //displaying list of companies
        for (let d of data) {
            const companyName = document.createElement('li');
            companyName.textContent = d.name;
            list.appendChild(companyName);
            //addEventListener('click', displayCompanyInfo(d));

        }
    }
    function displayCompanyInfo(data) {
        const h2 = document.createElement('h2');
        h2.textContent = "Company Information";
        companyInfoBox.appendChild(h2);
        const logo = document.createElement('img');
        //logo.setAttribute('src', data)
        const symbol = document.createElement('div');
        symbol.textContent = data.symbol;
        const sector = document.createElement('div');
        sector.textContent = data.sector;
        const subIndustry = document.createElement('div');
        subIndustry.textContent = data.subindustry;
        const address = document.createElement('div');
        address.textContent = data.address;
        const website = document.createElement('div');
        const companyURL = document.createElement('a');
        website.appendChild(companyURL);
        const exchange = document.createElement('div');
        exchange.textContent = data.exchange;
        const description = document.createElement('div');
        description.textContent = data.description;
    }

    function displayMap(latitude, longitude) {
        mapBox.style.height = '600px';
        map = new google.maps.Map(mapBox, {
            center: { lat: latitude, lng: longitude }, zoom: 6
        });
    }

    // now set up keyboard event handlers
    const searchBox = document.querySelector('.search');
    const suggestions = document.querySelector('#filterList');
    searchBox.addEventListener('keyup', displayMatches);

    // handler for keyboard input
    function displayMatches() {
        // don't start matching until user has typed in two letters
        if (this.value.length >= 2) {
            const matches = findMatches(this.value, parsedCompanyList);

            // first remove all existing options from list
            suggestions.innerHTML = "";

            // now add current suggestions to <datalist>
            matches.forEach(c => {
                var option = document.createElement('li');
                option.textContent = c.name;
                suggestions.appendChild(option);
            })

        }
    }

       // uses filter and regular expression to create list of matching movies
   function findMatches(wordToMatch, company) {
    return company.filter(obj => {
        const regex = new RegExp(wordToMatch, 'gi');
        return obj.name.match(regex);
      });
  }
});