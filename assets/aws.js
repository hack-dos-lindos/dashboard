localStorage.setItem("lastUpdateAws", new Date())

let timeAws = document.getElementById("aws-time")
let timeAwsExtend = document.getElementById("aws-time-extend")

function getStatusAWS(status) {
    if (status === 'Operational' || status === true) {
        return { text: 'All Clean', icon: './assets/img/check-circle.svg' }
    } else {
        return { text: 'Something went wrong', icon: './assets/img/x-circle.svg' }
    }
}


function filterStatusAWS(data) {

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

    let awsStatus = document.querySelector("#aws .general span")

    console.log(statusAWS);
    let status = getStatusAWS(statusAWS)

    console.log(awsStatus)

    awsStatus.querySelector('p').textContent = status.text
    awsStatus.querySelector('img').setAttribute('src', status.icon)
}

function createElementAWS(item, location) {
    const list = document.querySelector('ul')

    const newItem = document.createElement('li')
    newItem.classList.add("row")

    const img = document.createElement('img')
    newItem.appendChild(img)
    const container = document.createElement('div')
    const serviceName = document.createElement('p')
    container.appendChild(serviceName)
    const description = document.createElement('p')
    container.appendChild(description)
    newItem.appendChild(container)

    img.setAttribute('src', item.status.icon)
    serviceName.innerHTML = location + `<span>${item.name}</span>`
    description.innerHTML = item.status.text

    list.appendChild(newItem)
}


function filterServicesAWS(data) {

    let virginia = data['N. Virginia']
    let saoPaulo = data['Sao Paulo']
    let locations = [virginia, saoPaulo]

    locations.map((location) => {

        let locationKeys = Object.keys(location)

        for (let i = 0; i < locationKeys.length; i++) {
            let name = locationKeys[i];
            let status = location[name]

            createElementAWS({name: name, status: getStatusAWS(status)}, location)
        }
    })
}

function filterPicPayStatusAWS(data) {

    let virginia = data['N. Virginia']
    let saoPaulo = data['Sao Paulo']
    let locations = [virginia, saoPaulo]
    var picpayStatus = true

    locations.map((location) => {

        let locationKeys = Object.keys(location)

        for (let i = 0; i < locationKeys.length; i++) {
            let name = locationKeys[i];
            let status = location[name]

            if (status !== 'Operational') {
                picpayStatus = false
            }
        }
    })

    let picpayStatusAWS = document.querySelector("#aws .picpay span")

    let status = getStatusAWS(picpayStatus)

    picpayStatusAWS.querySelector('p').textContent = status.text
    picpayStatusAWS.querySelector('img').setAttribute('src', status.icon)
}

function loadDataAws() {
    let data = localStorage.getItem("lastUpdateAws")
    data = new Date(data)

    var differenceValue = (data.getTime() - new Date().getTime()) / 1000;
    differenceValue /= 60;
    let result = Math.abs(Math.round(differenceValue))
    
    timeAws.innerHTML = `Last update: ${result} ${result == 1 ? 'minutes' : 'minute'} ago` 
    timeAwsExtend.innerHTML = `Last update: ${result} ${result == 1 ? 'minutes' : 'minute'} ago` 

    localStorage.setItem("lastUpdateAws", new Date())
}

function lastUpdateAws() {
    fetch('https://feliz.onrender.com/aws')
    .then((response) => response.json())
    .then((data) => {
        filterStatusAWS(data)
        filterPicPayStatusAWS(data)
    })
}

loadDataAws()

setInterval(() => {
    loadDataAws()
    lastUpdateAws()
}, 120000)
