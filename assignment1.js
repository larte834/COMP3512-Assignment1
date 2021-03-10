//create maps
let map;
function initMap() {
    map = new google.maps.Map(document.querySelector("div.e"), {
        zoom: 6
    });
}

//load DOM
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

    // chart box
    const chartBox = document.querySelector('div.g');
    chartBox.style.display = "none";

    // speak box 
    const speakBox = document.querySelector('div.h');
    speakBox.style.display = "none";

    // financials box
    const financialsBox = document.querySelector('div.i');
    financialsBox.style.display = "none";

    //Create and append permanent header title
    const title = document.createElement('label');
    const credits = document.createElement('div');
    credits.setAttribute('id', 'crdts')
    title.textContent = "COMP 3512 Assign1";
    credits.textContent = "Credits"
    headerBox.appendChild(title);
    title.appendChild(credits);
    const section = document.createElement('section');
    headerBox.appendChild(section);

    //create elements to be displayed
    const name = document.createElement('label');
    const course = document.createElement('label');
    const party = document.createElement('label');

    //create temporary header
    function header() {
        section.style.display = "grid";
        //create text content
        name.textContent = "Randy Lam & Lidiya Artemenko";
        course.textContent = "COMP 3512";
        party.textContent = "Google Maps, ECharts, chartsjs";

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
    document.querySelector('#crdts').addEventListener('mouseenter', header);

    //declare variables
    const url1 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
    const animation = document.querySelector('.animate');
    const financialsStored = [];

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
            })
            .catch(err => console.log(err));
    }

    // fetch stock history
    parsedCompanyList = JSON.parse(listOfCompanies);
    displayList(parsedCompanyList);

    // create buttons for list 
    const input = document.querySelector('.form');
    const clearButton = document.createElement('button');
    clearButton.setAttribute('id', 'clearButton');
    clearButton.textContent = "CLEAR";
    input.appendChild(clearButton);
    clearButton.setAttribute("type", "reset");

    //display company list if 'clear' button clicked
    document.getElementById('clearButton').addEventListener('click', () => {
        displayList(parsedCompanyList);
    });

    //get input and ul
    const searchBox = document.querySelector('.search');
    const suggestions = document.querySelector('#filterList');
    //if key entered in input, sort list to display match
    searchBox.addEventListener('keyup', displayMatches);

    //display matches found
    function displayMatches() {
        const matches = findMatches(this.value, parsedCompanyList);
        suggestions.innerHTML = "";
        displayList(matches);
    }

    //find input match to company
    function findMatches(wordToMatch, parsedCompanyList) {
        return parsedCompanyList.filter(obj => {
            const regex = new RegExp(wordToMatch, 'gi');
            return obj.symbol.match(regex);
        });
    }

    //display list of companies
    function displayList(data) {
        const suggestions = document.querySelector('#filterList');

        //loop through list of companies
        for (let d of data) {
            //create list
            const companyName = document.createElement('li');
            companyName.textContent = `${d.name}, ${d.symbol}`;
            suggestions.appendChild(companyName);

            //when company clicked, populate page with information
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

                // create and display 3 charts
                displayChartA(d);

                //call on speak description function
                speak(d);

                //display financial information table when view btn clicked
                createViewBtn(d);
            });
        }
    }

    //display company information
    function displayCompanyInfo(data) {
        
        //clear info box
        companyInfoBox.innerHTML = "";

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
        website.appendChild(companyURL);

        //exchange
        exchange.textContent = "Exchange: " + data.exchange;
        companyInfoBox.appendChild(exchange);

        //description
        description.textContent = "Description: " + data.description;
        companyInfoBox.appendChild(description);
    }

    //set map coordinates
    function displayMap(data) {
        let coordinates = { lat: data.latitude, lng: data.longitude };
        map.setCenter(coordinates);
    }

    //fetch stock data and call on functions to display it
    function displayStockData(symbol) {
        queryString = `https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=${symbol}`;
        animation.style.display = "flex";
        // fetch stock info
        fetch(queryString)
            .then(response => {
                if (response.ok) { return response.json() }
                else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
            })
            .then(data => {
                animation.style.display = 'none';
                
                //call on function that create stock info table
                createStockTable(data);

                //call on function that creates avg, min, max table
                stockCalculation(data);

                //push data into array named financialsStored
                financialsStored.push(...data);

                //display candlestick graph
                //displayChartB(data);

            })
            .catch(err => console.log(err));
    }

    //create elements for view button
    const viewChartsButton = document.createElement('button');
    viewChartsButton.setAttribute('id', 'viewChartsButton');
    viewChartsButton.textContent = "View Charts";
    stockBox.appendChild(viewChartsButton);
    // viewChartsButton.style.cssFloat = "right";

    //call on view button event
    function createViewBtn(d) {
        //hide and display necessary display boxes 
        viewChartsButton.addEventListener('click', () => {
            listBox.style.display = "none";
            companyInfoBox.style.display = 'none';
            ammBox.style.display = "none";
            mapBox.style.display = "none";
            stockBox.style.display = "none";
    
            chartBox.style.display = "block";
            speakBox.style.display = "block";
            financialsBox.style.display = "block"
        });
        //call display financials when view button clicked
        displayFinancials(d);
    }

    //create table of stock data
    function createStockTable(data) {
        //call on chart view button
        //createViewBtn();

        //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_insert_deleterow
        //create table cells
        const table = document.querySelector('#stockTable');
        table.innerHTML = "";
        let title = document.createElement('h2');
        title.textContent = "Stock Data";
        table.appendChild(title);

        //create and populate first row of stock data table
        const caption = table.insertRow(0);
        let date = caption.insertCell(0);
        let open = caption.insertCell(1);
        let close = caption.insertCell(2);
        let low = caption.insertCell(3);
        let high = caption.insertCell(4);
        let volume = caption.insertCell(5);

        //add id's and links to table labels (row 1)
        date.innerHTML  = "<a href='#'>Date</a>";
        date.setAttribute('id', "date");
        
        open.innerHTML = "<a href='#'>Open</a>";
        open.setAttribute('id', 'open');
        
        close.innerHTML = "<a href='#'>Close</a>";
        close.setAttribute('id', "close");
        
        low.innerHTML = "<a href='#'>Low</a>";
        low.setAttribute('id', 'low');
        
        high.innerHTML = "<a href='#'>High</a>";
        high.setAttribute('id', 'high');
        
        volume.innerHTML = "<a href='#'>Volume</a>";
        volume.setAttribute('id', 'volume');

        //call on event handler to sort by column if top row label is clicked
        document.getElementById('date').addEventListener('click', () => {
            sortDate(data);
        });
        document.getElementById('open').addEventListener('click', () => {
            sortOpen(data);
        });
        document.getElementById('close').addEventListener('click', () => {
            sortClose(data);
        });
        document.getElementById('low').addEventListener('click', () => {
            sortLow(data);
        });
        document.getElementById('high').addEventListener('click', () => {
            sortHigh(data);
        });
        document.getElementById('volume').addEventListener('click', () => {
            sortVolume(data);
        });
        

        //loop through data and populate cells
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

    //create table with avg, min, max values
    function stockCalculation(data) {
        const table = document.querySelector('#stockCalc');

        //clear table
        table.innerHTML = "";
        
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
        //then assign min and max to cells

        const sortedOpen = data.sort((a, b) => {
            return a.open < b.open ? -1 : 1;
        });

        min_open.textContent = sortedOpen[0].open;
        max_open.textContent = sortedOpen[sortedOpen.length - 1].open;

        const sortedClose = data.sort((a, b) => {
            return a.close < b.close ? -1 : 1;
        });

        min_close.textContent = sortedClose[0].close;
        max_close.textContent = sortedClose[sortedClose.length - 1].close;

        const sortedLow = data.sort((a, b) => {
            return a.low < b.low ? -1 : 1;
        });

        min_low.textContent = sortedLow[0].low;
        max_low.textContent = sortedLow[sortedLow.length - 1].low;

        const sortedHigh = data.sort((a, b) => {
            return a.high < b.high ? -1 : 1;
        });

        min_high.textContent = sortedHigh[0].high;
        max_high.textContent = sortedHigh[sortedHigh.length - 1].high;

        const sortedVolume = data.sort((a, b) => {
            return a.volume < b.volume ? -1 : 1;
        });

        min_vol.textContent = sortedVolume[0].volume;
        max_vol.textContent = sortedVolume[sortedVolume.length - 1].volume;

        //calculate avg and populate cells
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

    let sortBool = true;

    //function to sort data by date
    function sortDate (data){
        const sortedDate = data.sort((a, b) => {
            if (sortBool)
                return a.date < b.date ? -1 : 1;
            else
                return a.date > b.date ? -1 : 1;
        });
        swapBool();
        createStockTable(sortedDate);
    }

    //function to sort data by open
    function sortOpen(data){
        const sortedOpen = data.sort((a, b) => {
            if(sortBool)
                return a.open < b.open ? -1 : 1;
            else 
            return a.open > b.open ? -1 : 1;
        });
        swapBool();
        createStockTable(sortedOpen);
    }

    //function to sort data by close
    function sortClose(data){
        const sortedClose = data.sort((a, b) => {
            if (sortBool)
                return a.close < b.close ? -1 : 1;
            else    
            return a.close > b.close ? -1 : 1;
        });
        swapBool();
        createStockTable(sortedClose);
    }

    //function to sort data by low
    function sortLow(data){
        const sortedLow = data.sort((a, b) => {
            if(sortBool)
                return a.low < b.low ? -1 : 1;
            else 
                return a.low > b.low ? -1 : 1;
        });
        swapBool();
        createStockTable(sortedLow);
    }

    //function to sort data by high
    function sortHigh(data){
        const sortedHigh = data.sort((a, b) => {
            if (sortBool)
                return a.high < b.high ? -1 : 1;
            else
            return a.high > b.high ? -1 : 1;
        });
        swapBool();
        createStockTable(sortedHigh);
    }

    //function to sort data by volume
    function sortVolume(data){
        const sortedVolume = data.sort((a, b) => {
            if(sortBool)
                return a.volume < b.volume ? -1 : 1;
            else
                return a.volume > b.volume ? -1 : 1;
        });
        swapBool();
        createStockTable(sortedVolume);
    }


    function swapBool(){
        if (sortBool)
            sortBool = false;
        else
            sortBool = true;

        return;
    }

    // function creates bar chart using chartjs.org
    function displayChartA(data1) {
        chartBox.innerHTML = '';
        //caption for chart
        const h2 = document.createElement('h2');
        h2.textContent = "Chart";
        chartBox.appendChild(h2);

        //create div to hold chart
        const chartA = document.createElement('div');
        chartA.setAttribute('id', 'chartA');
        chartBox.appendChild(chartA);
        
        // const chartC = document.createElement('div');
        // chartC.setAttribute('id', 'chartC');
        // chartBox.appendChild(chartC);   

        // Chart A - Bar
        let canvas1 = document.createElement('canvas');
        canvas1.setAttribute('id', 'canvas1');
        chartA.appendChild(canvas1);
        canvas1.setAttribute('height', 400);
        canvas1.setAttribute('width', 400);
        var ctx = document.getElementById('canvas1').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: data1.financials.years, 
                
                datasets: [{
                    label: 'Revenue',
                    backgroundColor: 'blue',
                    data: data1.financials.revenue,
                }, {
                    label: 'Earnings',
                    backgroundColor: 'green',
                    data: data1.financials.earnings,
                }, {
                    label: 'Assets',
                    backgroundColor: 'orange',
                    data: data1.financials.assets,
                }, {
                    label: 'Liabilities',
                    backgroundColor: 'red',
                    data: data1.financials.liabilities,
                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    labels: {
                        fontColor: 'black'
                    }
                }
            }
        });        

        // Chart C - Line
        // let canvas3 = document.createElement('canvas');
        // canvas3.setAttribute('id', 'canvas3');
        // chartC.appendChild(canvas3);
        // canvas3.setAttribute('height', 400);
        // canvas3.setAttribute('width', 400);
        // const ctx3 = document.getElementById('canvas3').getContext('2d');
        // const chart3 = new Chart(ctx3, {
        //     // The type of chart we want to create
        //     type: 'line',

        //     // The data for our dataset
        //     data: {
        //         labels: data2.date,
        //         datasets: [{
        //             label: 'Close',
        //             data: data2.close,
        //         }, {
        //             label: 'Volume',
        //             data: data2.volume,
        //         }]
        //     },
            
        //     // Configuration options go here
        //     options: {

        //     }
        // });

        // chartC.appendChild(canvas3);
        

        //     option: option
        // });

        // chartC.appendChild(canvas3);
        // // */

   }

//    function displayChartB(data) {
//        //select chart
//     let chartDom = document.getElementById('chartB');
//     let myChart = echarts.init(chartDom);
//     let option;

//     //create chart data
//     option = {
//         xAxis: {
//             data: ['Open', 'Close', 'Low', 'High']
//         },
//         yAxis: {
//             data: [20]
//         },
//         series: [{
//             type: 'candlestick',

//             data: [
//                 [20, 10, 38],
//                 [40, 30, 50],
//                 [31, 33, 44],
//                 [38, 5, 42]
//             ]
//         }]
// };
// option && myChart.setOption(option);

    // Chart B - Candlestick (needs both apis)
    // let canvas2 = document.createElement('canvas');
    // canvas2.setAttribute('id', 'canvas2');
    // chartB.appendChild(canvas2);
    // canvas2.setAttribute('height', 400);
    // var ctx2 = document.getElementById('canvas2').getContext('2d');
    // const sortedO = data.sort((a, b) => {
    //     return a.open < b.open ? -1 : 1;
    // });
    // var chart2 = new Chart(ctx2, {
    //     // The type of chart we want to create
    //     type: "candlestick",

    //     // The data for our dataset
    //     data: {
    //         datasets: [{
    //             label: 'min',
    //             data: sortedO[0],
    //         }, {
    //             label: 'max',
    //             //data: data2.max,
    //         }, {
    //             label: 'average',
    //             //data: ((data2.min + data2.max) / 2 ),
    //         }]
    //     },

    //     // Configuration options go here
    //     options: {}
    // });

    //     chartB.appendChild(canvas2);
//}

    // function that triggers speech 
    function speak(data2) {
        speakBox.innerHTML = '';
        //create speak button
        const speakButton = document.createElement('button');
        speakButton.setAttribute('id', 'speakButton');
        speakButton.textContent = "Speak";

        //create close button
        const closeButton = document.createElement('button');
        closeButton.setAttribute('id', 'closeButton');
        closeButton.textContent = "Close";
        
        //create header for section
        const h2 = document.createElement('h2');
        h2.textContent = `${data2.name}, ${data2.symbol}`;
        speakBox.appendChild(h2);

        //show company description
        const p = document.createElement('p');
        p.textContent = data2.description;

        //append elements
        speakBox.appendChild(speakButton);
        speakBox.appendChild(p);
        speakBox.appendChild(closeButton);

        //if 'speak' button clicked, read description
        speakButton.addEventListener('click', (e) => {
            // get the text to say the voice options from form
            let message = data2.description;

            // create utterance and give it text to speak
            let utterance = new SpeechSynthesisUtterance(message);
            // set the speech options (voice, rate, pitch)
            //utterance.voice = englishVoices.find(voice => voice.name === selectedVoice);
            //utterance.rate = document.querySelector('#rate').value;
            //utterance.pitch = document.querySelector('#pitch').value;
            // all ready, make it speak
            window.speechSynthesis.speak(utterance);

            //stop speech if 'close' button clicked
            closeButton.addEventListener('click', () => {
                window.speechSynthesis.cancel(utterance);
            });

        });

        //if 'close' button clicked, go to default display
        closeButton.addEventListener('click', () => {
            chartBox.style.display = "none";
            speakBox.style.display = "none";
            financialsBox.style.display = "none";

            listBox.style.display = "grid";
            companyInfoBox.style.display = 'block';
            ammBox.style.display = "block";
            mapBox.style.display = "block";
            stockBox.style.display = "block";
        });

    }

    //function to display company financial information
    function displayFinancials(data) {

        //select table and add a caption
        const financeTable = document.querySelector('#financials');
        financeTable.innerHTML = "";
        let caption = document.createElement('h2');
        caption.textContent = "Financials";
        financeTable.appendChild(caption);

        //create rows
        let years = financeTable.insertRow(0);
        let revenues = financeTable.insertRow(1);
        let earnings = financeTable.insertRow(2);
        let assets = financeTable.insertRow(3);
        let liabilities = financeTable.insertRow(4);

        //create row cells
        let yrs = years.insertCell(0);
        let rev = revenues.insertCell(0);
        let earn = earnings.insertCell(0);
        let asts = assets.insertCell(0);
        let liab = liabilities.insertCell(0);

        //populate column 1
        yrs.textContent = "Years";
        rev.textContent = "Revenue";
        earn.textContent = "Earnings";
        asts.textContent = "Assets";
        liab.textContent = "Liabilities";

        //populate year row
        let yr2019 = years.insertCell(1);
        let yr2018 = years.insertCell(2);
        let yr2017 = years.insertCell(3);

        yr2019.textContent = data.financials.years[0];
        yr2018.textContent = data.financials.years[1];
        yr2017.textContent = data.financials.years[2];

        //populate revenue row
        let rv2019 = revenues.insertCell(1);
        let rv2018 = revenues.insertCell(2);
        let rv2017 = revenues.insertCell(3);

        rv2019.textContent = "$"+numberCommas(data.financials.revenue[0]);
        rv2018.textContent = "$"+numberCommas(data.financials.revenue[1]);
        rv2017.textContent = "$"+numberCommas(data.financials.revenue[2]);

        //populate Earnings row
        let earn2019 = earnings.insertCell(1);
        let earn2018 = earnings.insertCell(2);
        let earn2017 = earnings.insertCell(3);

        earn2019.textContent = "$"+numberCommas(data.financials.earnings[0]);
        earn2018.textContent = "$"+numberCommas(data.financials.earnings[1]);
        earn2017.textContent = "$"+numberCommas(data.financials.earnings[2]);

        //populate assets row
        let as2019 = assets.insertCell(1);
        let as2018 = assets.insertCell(2);
        let as2017 = assets.insertCell(3);

        as2019.textContent = "$"+numberCommas(data.financials.assets[0]);
        as2018.textContent = "$"+numberCommas(data.financials.assets[1]);
        as2017.textContent = "$"+numberCommas(data.financials.assets[2]);

        //populate liabilities row
        let li2019 = liabilities.insertCell(1);
        let li2018 = liabilities.insertCell(2);
        let li2017 = liabilities.insertCell(3);

        li2019.textContent = "$"+numberCommas(data.financials.liabilities[0]);
        li2018.textContent = "$"+numberCommas(data.financials.liabilities[1]);
        li2017.textContent = "$"+numberCommas(data.financials.liabilities[2]);
    }

    //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    //add commas to long numbers
    function numberCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});