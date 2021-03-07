//create maps
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

    //stock data box
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

        //hide header after 5 seconds
        setTimeout(function () {
            section.style.display = "none";
        }, 5000);
    }

    //show header section when mouse over
    credits.addEventListener('mouseenter', header);

    const url1 = 'http://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';

    //declare variables
    const animation = document.querySelector('.animate');
    const coList = [];

    //initially hide sections until company selected
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
    parsedCompanyList = JSON.parse(listOfCompanies);
    displayList(parsedCompanyList);

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

    const searchBox = document.querySelector('.search');
    const suggestions = document.querySelector('#filterList');
    searchBox.addEventListener('keyup', displayMatches);

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
        const suggestions = document.querySelector('#filterList');

        //displaying list of companies
        for (let d of data) {
            const companyName = document.createElement('li');
            companyName.textContent = d.name;
            suggestions.appendChild(companyName);

            companyName.addEventListener('click', (e) => {
                document.querySelector("div.c").style.display = "block";
                document.querySelector("div.d").style.display = "block";
                document.querySelector("div.e").style.display = "block";
                document.querySelector("div.f").style.display = "block";

                //call on company info to display
                displayCompanyInfo(d);

                //call on map to display
                displayMap(d);

                //call on stock data to display
                displayStockData(d.symbol);
            });
        }
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
        let coordinates = { lat: data.latitude, lng: data.longitude };
        map.setCenter(coordinates);
    }

    //create elements for stock box
    const viewChartsButton = document.createElement('button');
    viewChartsButton.textContent = "View Charts";
    stockBox.appendChild(viewChartsButton);

    function displayStockData(symbol){
        queryString = `http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=${symbol}`;
        
        // fetch stock info
        fetch(queryString)
        .then(response => {
            if (response.ok) { return response.json() }
            else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
        })
        .then(data => {
            createStockTable(data);
            stockCalculation(data);
        })
        .catch(err => console.log(err));
    }

    function createStockTable(data) {
        //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_insert_deleterow
        const table = document.querySelector('#stockTable');
        table.createCaption();
        table.textContent = "Stock Data";
        const caption = table.insertRow(0);
        let date = caption.insertCell(0);
        let open = caption.insertCell(1);
        let close = caption.insertCell(2);
        let low = caption.insertCell(3);
        let high = caption.insertCell(4);
        let volume = caption.insertCell(5);

        date.textContent = "Date";
        open.textContent = "Open";
        close.textContent = "Close";
        low.textContent = "Low";
        high.textContent = "High";
        volume.textContent = "Volume";

        
            for (let d of data) {
                const row = table.insertRow(1);
                
                let stockDate = d.date;
                let stockOpen = d.open;
                let stockClose = d.close;
                let stockLow = d.low;
                let stockHigh = d.high;
                let stockVolume = d.volume;

                stockDate = row.insertCell(0);
                stockOpen = row.insertCell(1);
                stockClose = row.insertCell(2);
                stockLow = row.insertCell(3);
                stockHigh = row.insertCell(4);
                stockVolume = row.insertCell(5);

                stockDate.textContent = d.date;
                stockOpen.textContent = d.open;
                stockClose.textContent = d.close;
                stockLow.textContent = d.low;
                stockHigh.textContent = d.high;
                stockVolume.textContent = d.volume;
            }
    }

    function stockCalculation(data) {
        const table = document.querySelector('#stockCalc');
        //creating table rows 
        const average = table.insertRow(0);
        const minimum = table.insertRow(1);
        const maximum = table.insertRow(2);

        //create table cells for row 1
        let avg = average.insertCell(0);
        let avg_open = average.insertCell(1);
        let avg_close = average.insertCell(2);
        let avg_low = average.insertCell(3);
        let avg_high = average.insertCell(4);
        let avg_vol = average.insertCell(5);

        //create table cells for row 2
        let min = minimum.insertCell(0);
        let min_open = minimum.insertCell(1);
        let min_close = minimum.insertCell(2);
        let min_low = minimum.insertCell(3);
        let min_high = minimum.insertCell(4);
        let min_vol = minimum.insertCell(5);

        //create table cells for row 3
        let max = maximum.insertCell(0);
        let max_open = maximum.insertCell(1);
        let max_close = maximum.insertCell(2);
        let max_low = maximum.insertCell(3);
        let max_high = maximum.insertCell(4);
        let max_vol = maximum.insertCell(5);

        //assign content to cells
        avg.textContent = "Average";
        min.textContent = "Min";
        max.textContent = "Max"; 

        //sort through open, close, high, low and volume and return list of sorted numbers
        //then assign mix and max to cells
        const sortedOpen = data.sort( (a,b) => {
            return a.open < b.open ? -1 : 1;
        });

        min_open.textContent = sortedOpen[0].open;
        max_open.textContent = sortedOpen[sortedOpen.length-1].open;

        const sortedClose = data.sort( (a,b) => {
            return a.close < b.close ? -1 : 1;
        });

        min_close.textContent = sortedClose[0].close;
        max_close.textContent = sortedClose[sortedClose.length-1].close;

        const sortedLow = data.sort( (a,b) => {
            return a.low < b.low ? -1 : 1;
        });

        min_low.textContent = sortedLow[0].low;
        max_low.textContent = sortedLow[sortedLow.length-1].low;

        const sortedHigh = data.sort( (a,b) => {
            return a.high < b.high ? -1 : 1;
        });

        min_high.textContent = sortedHigh[0].high;
        max_high.textContent = sortedHigh[sortedHigh.length-1].high;

        const sortedVolume = data.sort( (a,b) => {
            return a.volume < b.volume ? -1 : 1;
        });
        
        min_vol.textContent = sortedVolume[0].volume;
        max_vol.textContent = sortedVolume[sortedVolume.length-1].volume;

        let total = 0;
        for(let i = 0; i < data.length; i++) {
            total += parseFloat(data[i].open);
        }

        let avgCalc = total/data.length;
        avg_open.textContent = avgCalc;

        total = 0;
        for(let i = 0; i < data.length; i++) {
            total += parseFloat(data[i].close);
        }

        avgCalc = total/data.length;
        avg_close.textContent = avgCalc;

        total = 0;
        for(let i = 0; i < data.length; i++) {
            total += parseFloat(data[i].low);
        }

        avgCalc = total/data.length;
        avg_low.textContent = avgCalc;

        total = 0;
        for(let i = 0; i < data.length; i++) {
            total += parseFloat(data[i].high);
        }

        avgCalc = total/data.length;
        avg_high.textContent = avgCalc;

        total = 0;
        for(let i = 0; i < data.length; i++) {
            total += parseFloat(data[i].volume);
        }
        
        avgCalc = total/data.length;
        avg_vol.textContent = avgCalc;
        
    }
});