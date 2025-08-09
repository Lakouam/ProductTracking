const { ipcRenderer } = require('electron');



document.addEventListener('DOMContentLoaded', () => {

    // when selecting a post, send the post name to main process
    {
        document.getElementById("posteSelect").addEventListener("change", function(event) {
            // get the postSelect value
            const postSelect = document.getElementById("posteSelect").value;
            // send the postSelect value to main process
            ipcRenderer.send("Post Select", postSelect);
        });
    }




    // receive posts names from the main process and show them in the postSelect and request the post actuel and select it
    {
        ipcRenderer.invoke("Posts Names").then(data => {
            // get the postSelect
            const postSelect = document.getElementById("posteSelect");
            postSelect.innerHTML = ""; // clear the postSelect
            for (const post of data) {
                // create an option element
                const option = document.createElement("option");
                // set the value and text of the option
                option.value = post;
                option.innerText = post;
                // add the option to the postSelect
                postSelect.appendChild(option);
            }

            // request post actuel from main process and select it
            ipcRenderer.invoke('Post Actuel').then(postActuel => {
                document.getElementById("posteSelect").value = postActuel.name;
                if(postActuel.isnull) postSelect.dispatchEvent(new Event('change')); // first time we select the post from local storage, the event 'change' is not triggered
                                                                                     // so we need to trigger it manually (because post values are null) to fill them from DB
            });

        });
    }

});