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
    const list = document.querySelector('#aws-items')

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
// fetch('https://feliz.onrender.com/aws')
//     .then((response) => response.json())
//     .then((data) => {
//         filterStatusAWS(data)
//         filterPicPayStatusAWS(data)
//     })


// fetch('https://feliz.onrender.com/aws')
// .then((response) => response.json())
// .then((data) => filterServicesAWS(data))

function createElementIssueAWS(issues) {

    console.log('dentro')
    console.log(issues)
    // function that adds a item to the items list
    const list = document.querySelector('#aws-issues-items')
    console.log(list)

    issues.map(
        (issue) => {
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

            img.setAttribute('src', './assets/img/x-circle.svg')
            serviceName.innerHTML = issue.region + `<span>${issue.service}</span>`
            description.innerHTML = `${issue.date.toLocaleString().substr(0, 10)} - ${issue.issue}`

            console.log(newItem)
            console.log(list)
            list.appendChild(newItem)
        }
    )
    
}

function yearIssuesAWS(data){
    let list = []
    data.map(
        (item) => {

            let region = item.region_name
            let service = item.service_name
            let issue = item.event_type_code
            let date = new Date(item.launch_date*1000)

            list.push({date, region, service, issue})
        }
    )
    let listServer = list.filter((item) => {
        return item.region === 'N. Virginia' || item.region === 'Sao Paulo' 
    })
    let listYear = listServer.filter((item) => {
        return item.date > new Date("2023-01-01")
    })

    console.log(listYear)
    createElementIssueAWS(listYear)
}

fetch('https://di1pzre3hzbi4.cloudfront.net/services.json')
    .then((response) => response.json())
    .then((data) => yearIssuesAWS(data))
