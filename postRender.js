// import ipcRenderer from electron
//const {ipcRenderer} = require('electron');




// register the post actuel in the main process
{
    // when selecting a post, send the post name to main process
    {
        document.getElementById("postSelect").addEventListener("change", function(event) {
            // get the postSelect value
            const postSelect = document.getElementById("postSelect").value;
            // send the postSelect value to main process
            ipcRenderer.send("Post Select", postSelect);
        });
    }

}




// receive posts names from the main process and show them in the postSelect and request the post actuel and select it
{
    ipcRenderer.on("Posts Names", (event, data) => {
        // get the postSelect
        const postSelect = document.getElementById("postSelect");
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
            document.getElementById("postSelect").value = postActuel;
        });

    });
}