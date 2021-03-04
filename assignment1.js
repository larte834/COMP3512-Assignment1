let map;
function initMap() {
    map = new google.maps.Map(document.querySelector("div.e"), {
        zoom: 6
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // set DOMS
    const headerBox = document.querySelector('div.a');
    const listBox = document.querySelector('div.b');
    const companyInfoBox = document.querySelector('div.c');
    const ammBox = document.querySelector('div.d');
    const mapBox = document.querySelector('div.e');
    const stockBox = document.querySelector('div.f');

    //Create and append header
    const title = document.createElement('label');
    const credits = document.createElement('label');
    title.textContent = "COMP 3512 Assign1";
    credits.textContent = "Credits"
    headerBox.appendChild(title);
    headerBox.appendChild(credits);

    //Create and append header section
    const section = document.createElement('section');
    headerBox.appendChild(section);
    //create elements to be displayed
    const name = document.createElement('label');
    const course = document.createElement('label');
    const party = document.createElement('label');

    function header() {
        section.style.display = "grid";
        //create text content
        name.textContent = "Randy Lam & Lidiya Artemenko";
        course.textContent = "Comp 3512";
        party.textContent = "";

        //append labels to the div
        section.appendChild(name);
        section.appendChild(course);
        section.appendChild(party);

        setTimeout(function () {
            section.style.display = "none";
        }, 5000);
    }

    //show header section when mouse over
    credits.addEventListener('mouseenter', header);


    const url1 = 'http://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
    const url2 = 'http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=xxx';

    const animation = document.querySelector('.animate');
    const coList = [];

    function clearScreen() {
        document.querySelector("div.c").style.display = "none";
        document.querySelector("div.d").style.display = "none";
        document.querySelector("div.e").style.display = "none";
        document.querySelector("div.f").style.display = "none";
    }
    clearScreen();

    // check for local storage, not doesn't exist then fetch
    let listOfCompanies = localStorage.getItem('listOfCompanies');
    if (listOfCompanies) {
        animation.style.display = "flex";
        fetch(url1)
            .then(response => {
                if (response.ok) { return response.json() }
                else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
            })
            .then(data => {
                animation.style.display = 'none';
                // save local storage
                let json = JSON.stringify(data);
                localStorage.setItem('listOfCompanies', json);
                coList.push(...data); 
                displayList(data);
            })
            .catch(err => console.log(err));
    }

    // create buttons for list 
    const input = document.querySelector('.form');
    const goButton = document.createElement('button');
    const clearButton = document.createElement('button');
    goButton.setAttribute('id', 'goButton');
    goButton.textContent = "GO";
    clearButton.setAttribute('id', 'clearButton');
    clearButton.textContent = "CLEAR";
    input.appendChild(goButton);
    input.appendChild(clearButton);
    clearButton.setAttribute("type", "reset");
    goButton.setAttribute("type", "button");

    clearButton.addEventListener('click', () => {
        clearScreen();
    });
    
    // parsedCompanyList= JSON.parse(listOfCompanies);
    // displayList(parsedCompanyList);

    function displayList(data) {
        const list = document.createElement('ul');
        listBox.appendChild(list);
        //displaying list of companies
        for (let d of data) {
            const companyName = document.createElement('li');
            companyName.textContent = d.name;
            list.appendChild(companyName);

            listBox.addEventListener('click', (e) => {
                if (e.target !== companyName && e.target !== goButton) {
                    return;
                }
                    document.querySelector("div.c").style.display = "block";
                    document.querySelector("div.d").style.display = "block";
                    document.querySelector("div.e").style.display = "block";
                    document.querySelector("div.f").style.display = "block";
                    //call on company info
                    displayCompanyInfo(d);

                    //call on map
                    displayMap(d);
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
    }

    function findMatches(wordToMatch, coList) {
        return coList.filter(obj => {
            const regex = new RegExp(wordToMatch, 'gi');
            return obj.symbol.match(regex);
        });
    }

    //create elements to populate company info
    const h2 = document.createElement('h2');
    const logo = document.createElement('img');
    const symbol = document.createElement('div');
    const sector = document.createElement('div');
    const subIndustry = document.createElement('div');
    const address = document.createElement('div');
    const website = document.createElement('div');
    const companyURL = document.createElement('a');
    const exchange = document.createElement('div');
    const description = document.createElement('div');

    //display company information
    function displayCompanyInfo(data) {
        //header
        h2.textContent = "Company Information";
        companyInfoBox.appendChild(h2);
        
        //image
        logo.setAttribute('src', `logos/${data.symbol}.svg`)
        companyInfoBox.appendChild(logo);

        //symbol
        symbol.textContent = "Symbol: " + data.symbol;
        companyInfoBox.appendChild(symbol);
        
        //sector
        sector.textContent = "Sector: " + data.sector;
        companyInfoBox.appendChild(sector);

        //subindustry
        subIndustry.textContent = "Subindustry: " + data.subindustry;
        companyInfoBox.appendChild(subIndustry);
        
        //address
        address.textContent = "Address: " + data.address;
        companyInfoBox.appendChild(address);
        
        //website
        website.textContent = "Website: ";
        companyURL.textContent = data.website;
        companyInfoBox.appendChild(website);
        companyURL.setAttribute('href', data.website);
        companyInfoBox.appendChild(companyURL);
  
        //exchange
        exchange.textContent = "Exchange: " + data.exchange;
        companyInfoBox.appendChild(exchange);
        
        //description
        description.textContent = "Description: " + data.description;
        companyInfoBox.appendChild(description);
    }

    function displayMap(data) {
        let coordinates = {lat: data.latitude, lng: data.longitude};
        map.setCenter(coordinates);
    }

});