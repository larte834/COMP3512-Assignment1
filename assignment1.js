document.addEventListener("DOMContentLoaded", function() { 
    //header();

        //set header text
        const info = document.querySelector('div.a');
        info.textContent = "COMP 3512 Assign1";

        function header() {
            const info = document.querySelector('div.a');
            document.querySelector("div.a").style.display = "grid";
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
            header()
 
            //hide header info after 5 sec
            setTimeout( function () {
                header().style.display='none';
            }, 5000);
        })

});