
document.addEventListener("DOMContentLoaded", function () {

    //set header text
    const info = document.querySelector('div.a');
    const title = document.createElement('label');
    info.appendChild(title);
    title.textContent = "COMP 3512 Assign1";

    //show site information that will disappear when mouse enters
    info.addEventListener('mouseenter', (e) => {
        //show header info
        const section = document.createElement('section');
        info.appendChild(section);
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
            section.innerHTML = '';
        }, 5000);

        //https://stackoverflow.com/questions/40554378/clear-innerhtml-after-5-seconds
        // function showSnackBar(message) {
        //     const snack = document.querySelector("#snackbar");
        //     snack.textContent = message;
        //     snack.classList.add("show");
        //     setTimeout( () => {
        //        snack.classList.remove("show");
        //     }, 3000);
        //  }

        // function removeTransition(e) {
        //     if (e.propertyName !== 'transform') return;
        //     this.classList.remove('playing');
        // }
    })
    const url1 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php';
    const url2 = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=xxx';

    /*
    const listofCompanies = document.querySelector('div.b');
    let input = document.createElement('input');
    input.setAttribute("type", "text");
    listofCompanies.appendChild(input);
    const listTitle = document.createElement('label');
    listTitle.textContent = "List of Companies";
    listofCompanies.appendChild(listTitle); 
    */

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

    // function companies(company) {
    //     const select = document.createElement('select');
    //     listofCompanies.appendChild(select);
    //     for (let c of company) {
    //         let opt = document.createElement('option');
    //         opt.setAttribute('value', c.symbol);
    //         opt.textContent = c.name;
    //         select.appendChild(input);
    //     }
    // }





    // fetch(url)
    //         .then(response => {
    //                 if (response.ok) { return response.json()}
    //                 else { return Promise.reject({ status: response.status, statusTest: response.statusText})} 
    //         })
    //         .then( data => {console.dir(data);})
    //         .catch( err => {console.log(err)});




    // function a(galleries) {
    //     document.querySelector("#galleryName").textContent = galleries.nameEn;
    //     document.querySelector("#galleryCity").textContent = galleries.location.city;
    //     document.querySelector("#galleryNative").textContent = galleries.nameNative;;
    //     document.querySelector("#galleryAddress").textContent = galleries.location.address;
    //     document.querySelector("#galleryCountry").textContent = galleries.location.country;
    //     document.querySelector("#galleryHome").href = galleries.link;
    //     document.querySelector("#galleryHome").textContent = galleries.link;
    // }

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

});