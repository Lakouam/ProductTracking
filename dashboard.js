// send a message to the main process when the user clicks on the card to open the card window
{
    document.getElementById('showDataCard').onclick = () => ipcRenderer.send('open-show-data');
    document.getElementById('modifyNofCard').onclick = () => ipcRenderer.send('open-modify-nof');
    document.getElementById('modifyPostsCard').onclick = () => ipcRenderer.send('open-modify-posts');
    document.getElementById('showGammesCard').onclick = () => ipcRenderer.send('open-show-gammes');
    document.getElementById('showOperationsCard').onclick = () => ipcRenderer.send('open-show-operations');
}
