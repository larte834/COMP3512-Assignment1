let map;
function initMap() {
    map = new google.maps.Map(document.querySelector("div.e"), {
        zoom: 6
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // set up layout

    //header box
    const headerBox = document.querySelector('div.a');

    // company list box
    const listBox = document.querySelector('div.b');

    // company info box 
    const companyInfoBox = document.querySelector('div.c');

    // average min max box
    const ammBox = document.querySelector('div.d');

    // map box 
    const mapBox = document.querySelector('div.e');

    // stock data box 
    const stockBox = document.querySelector('div.f');
    h3stockDate = document.createElement('h3');
    h3stockDate.textContent = "Date";
    stockBox.appendChild(h3stockDate);

    h3stockOpen = document.createElement('h3');
    h3stockOpen.textContent = "Open";
    stockBox.appendChild(h3stockOpen);

    h3stockClose = document.createElement('h3');
    h3stockClose.textContent = "Close"
    stockBox.appendChild(h3stockClose);

    h3stockLow = document.createElement('h3');
    h3stockLow.textContent = "Low";
    stockBox.appendChild(h3stockLow);

    h3stockHigh = document.createElement('h3');
    h3stockHigh.textContent = "High";
    stockBox.appendChild(h3stockHigh);
    
    h3stockVolume = document.createElement('h3');
    h3stockVolume.textContent = "Volume";
    stockBox.appendChild(h3stockVolume);


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

    // check for local storage copy of companies, not doesn't exist then fetch
    let listOfCompanies = localStorage.getItem('listOfCompanies');
    if (!listOfCompanies) {
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
        })
        .catch(err => console.log(err));
    }

    // fetch stock history

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

    parsedCompanyList = JSON.parse(listOfCompanies);
    displayList(parsedCompanyList);

    const searchBox = document.querySelector('.search');
    const suggestions = document.querySelector('#filterList');
    // searchBox.addEventListener('keyup', displayMatches);

    function displayMatches() {
        const matches = findMatches(this.value, coList);

        suggestions.innerHTML = "";

            matches.forEach(m => {
                let li = document.createElement('li');
                li.textContent = m.name+", "+m.symbol;
                suggestions.appendChild(li);
            });
    }

    function findMatches(wordToMatch, coList) {
        return coList.filter(obj => {
            const regex = new RegExp(wordToMatch, 'gi');
            return obj.symbol.match(regex);
        });
    }

    function displayList(data) {
        const searchBox = document.querySelector('.search');
        const suggestions = document.querySelector('#filterList');
        //displaying list of companies
        for (let d of data) {
            const companyName = document.createElement('li');
            companyName.textContent = d.name;
            suggestions.appendChild(companyName);
            //suggestions.addEventListener('change', (e) => {
                searchBox.addEventListener('keyup', displayMatches);
            //});
            companyName.addEventListener('click', (e) => {
                // if (e.target !== companyName && e.target !== goButton) {
                //     return;
                // }
                document.querySelector("div.c").style.display = "block";
                document.querySelector("div.d").style.display = "block";
                document.querySelector("div.e").style.display = "block";
                document.querySelector("div.f").style.display = "block";
                //call on company info
                displayCompanyInfo(d);

                //call on map
                displayMap(d);

                // call displayStockInfo
                //displayStockData(d.symbol);
            });
        }
    }

    // const searchBox = document.querySelector('.search');
    // searchBox.addEventListener('change', search_list);
    // function search_list() { 
    //     let input = document.querySelector('.search').value;
    //     input = input.toLowerCase(); 
    //     let x = document.querySelector('#filterList'); 
          
    //     for (i = 0; i < x.length; i++) {  
    //         if (!x[i].innerHTML.toLowerCase().includes(input)) { 
    //             x[i].style.display="none"; 
    //         } 
    //         else { 
    //             x[i].style.display="list-item";                  
    //         } 
    //     } 
    // } 




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
        let coordinates = { lat: data.latitude, lng: data.longitude };
        map.setCenter(coordinates);
    }

    // function displayStockData(symbol){

    //     queryString = `http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=${symbol}`;
    //     const h2 = document.createElement('h2');
    //     h2.textContent = "Stock Data";
    //     const viewChartsButton = document.createElement('button');
    //     h2.appendChild(stockBox);
    //     viewChartsButton.appendChild(stockBox);


    //     // fetch stock info
    //     fetch(queryString)
    //     .then(response => {
    //         if (response.ok) { return response.json() }
    //         else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
    //     })
    //     .then(data => {
    //         for (d of data) {
    //             let stockDate = document.createElement('div');
    //             let stockOpen = document.createElement('div');
    //             let stockClose = document.createElement('div');
    //             let stockLow = document.createElement('div');
    //             let stockHigh = document.createElement('div');
    //             let stockVolume = document.createElement('div');

    //             //stockDate = d.date.toString;
    //             stockOpen = d.open;
    //             stockClose = d.close;
    //             stockLow = d.low;
    //             stockHigh = d.high;
    //             stockVolume = d.volume;

    //             // test function
    //             console.log(stockDate, stockOpen, stockClose, stockHigh, stockLow, stockVolume);
    //         }
    //     })
    //     .catch(err => console.log(err));


    // }
});