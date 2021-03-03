document.addEventListener("DOMContentLoaded", function () {
        //set header text
        const header = document.querySelector('div.a');
        const title = document.createElement('label');
        header.appendChild(title);
        title.textContent = "COMP 3512 Assign1";
    
        const section = document.createElement('section');
        header.appendChild(section);
    
        header.addEventListener('mouseenter', (e) => {  
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
            setTimeout( function () {
                section.style.display = "none";
            }, 5000);
        })

    const url1 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
    const url2 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=xxx';

    const animation = document.querySelector('.animate');
    const companyList = document.querySelector('div.b');
    // check for local storage, not doesn't exist then fetch
    let listOfCompanies = localStorage.getItem('listOfCompanies');
    if (!listOfCompanies) {
        fetch(url1)
            .then(response => {
                animation.style.display = 'none';
                if (response.ok) { return response.json() }
                else { return Promise.reject({ status: response.status, statusTest: response.statusText }) }
            })
            .then(data => {
                displayList(data);
                // save local storage
                let json = JSON.stringify(data);
                localStorage.setItem('listOfCompanies');
            })
            .catch(err => { console.log(err) });
    }

    function displayList(data) {
        // displaying list of companies
        const list = document.createElement('ul');
        list.setAttribute('id', 'ul1');
        companyList.appendChild(list);
        for (d of data) {
            const companyName = document.createElement('li');
            companyName.textContent = d.name;
            list.appendChild(companyName);
        }
    }
});