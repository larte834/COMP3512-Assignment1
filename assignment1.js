document.addEventListener("DOMContentLoaded", function () {

    const boxSelector = document.querySelectorAll('.box');
    // display functions
    header();
    displayList();

    //set header text
    const info = document.querySelector('div.a');
    const title = document.createElement('label');
    //title.appendChild(title);
    info.textContent = "COMP 3512 Assign1";

    
    function header() {
        const info = document.querySelector('div.a');
        info.style.display = "grid";
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
        info.appendChild(credits);
        info.appendChild(name);
        info.appendChild(course);
        info.appendChild(party);
    }

    

    info.addEventListener('mouseover', (e) => {
        //show header info
        //header()
        const section = document.createElement('section');
        info.appendChild(section);
        section.style.display = "grid";
        // create elements to be displayed
        const credits = document.createElement('label');
        const name = document.createElement('label');
        const course = document.createElement('label');
        const party = document.createElement('label');

        // create text content
        credits.textContent = 'Credits';
        name.textContent = 'Randy Lam & Lidiya Artemenko';
        course.textContent = 'COMP 3512';
        party.textContent = '';

        // append labels to the div
        section.appendChild(credits);
        section.appendChild(name);
        section.appendChild(course);
        section.appendChild(party);


        //hide header info after 5 sec
        setTimeout(function () {
            section.innerHTML = '';
        }, 5000);
    })


    function displayList() {
        // displaying list of companies
        const companies = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
        const animation = document.querySelector('.animation');
        const companyList = document.querySelector('div.b');
        fetch(companies)
            .then(response => response.json())
            .then(data => {
                // hide animation
                animation.style.display = 'none';
                const list = document.createElement('ul');
                companyList.appendChild(list);
                for (d of data) {
                    const companyName = document.createElement('li');
                    companyName.textContent = d.name;
                    list.appendChild(companyName);
                }
                let json = JSON.stringify(data);
                localStorage.setItem('companyList', json);

            })
            .catch(error => console.error(error));
    }


});