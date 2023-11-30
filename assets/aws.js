function getStatusAWS(status) {
    if (status === 'Operational' || status === true) {
        return { text: 'All Clean', icon: './assets/img/check-circle.svg' }
    } else {
        return { text: 'Something went wrong', icon: './assets/img/x-circle.svg' }
    }
}


function filterStatusAWS(data) {

    console.log('DENTRO')

    let virginia = data['N. Virginia']
    let saoPaulo = data['Sao Paulo']
    let locations = [virginia, saoPaulo]
    var statusAWS = true

    locations.map((location) => {

        let locationKeys = Object.keys(location)

        for (let i = 0; i < locationKeys.length; i++) {
            let name = locationKeys[i];
            let status = location[name]

            if (status !== 'Operational') {
                statusAWS = false
            }
        }
    })

    let jiraStatus = document.querySelector("#aws .general span")
    let status = getStatusJira(statusAWS)

    jiraStatus.querySelector('p').textContent = status.text
    jiraStatus.querySelector('img').setAttribute('src', status.icon)
}

fetch('https://feliz.onrender.com/aws')
    .then((response) => response.json())
    .then((data) => filterStatusAWS(data))

