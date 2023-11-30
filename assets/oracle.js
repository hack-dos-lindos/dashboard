// ORACLE

// esse método pode ser usado para renderizar o status geral da Cloud da Oracle no lugar dos console.log()
function filterStatusOracle(data) {
    // página é a OCI 
    let page = data['page']['name']
    // status é se está funcionando ou não
    let rawStatus = data['status']['description']
    let oracleStatus = document.querySelector
        ("#oracle .general span")
    let status = getStatus(rawStatus)

    oracleStatus.querySelector('p').textContent = status.text
    oracleStatus.querySelector('img').setAttribute('src', status.icon)
}

// esse método filtra apenas os dados da cidade buscada no locationName
function filterComponentsOracle(data, locationName) {
    let reports = data['regionHealthReports']

    return reports.filter(
        (report) => locationName === report['regionName']
    )
}

// esse método pode ser usado para renderizar o status da cidade buscada no método filter components no lugar dos console.log()
function filterServicesOracle(data) {

    let services = data[0]['serviceHealthReports']

    services.map(
        (service) => {
            let serviceName = service['serviceName']
            let serviceStatus = service['serviceStatus']
            createElementOracle({ name: serviceName, status: getStatus(serviceStatus) })
        }
    )
}

function filterPicpayServicesOracle(data, locationNames) {

    let picpayStatus = true

    locationNames.map(
        (locationName) => {
            let filtered_components = filterComponentsOracle(data, locationName)
            let services = filtered_components[0]['serviceHealthReports']
            let notNormalPerformanceServices = services.filter(
                (service) => service['serviceStatus'] !== 'NormalPerformance'
            )
            if (notNormalPerformanceServices.length) {
                picpayStatus = false
            }
        }
    )

    let oracleStatus = document.querySelector
        ("#oracle .picpay span")
    let status = getStatus(picpayStatus)

    oracleStatus.querySelector('p').textContent = status.text
    oracleStatus.querySelector('img').setAttribute('src', status.icon)
}

function getStatus(status) {
    if (status === 'NormalPerformance' || status === true || status === 'Normal Performance') {
        return { text: 'All Clean', icon: './assets/img/check-circle.svg' }
    } else {
        return { text: 'Something went wrong', icon: './assets/img/x-circle.svg' }
    }
}

function createElementOracle(item) {
    const list = document.querySelector('ul')

    // function that adds a item to the items list
    const newItem = document.createElement('li')
    newItem.classList.add("row")

    const img = document.createElement('img')
    newItem.appendChild(img)
    const container = document.createElement('div')
    const service = document.createElement('p')
    container.appendChild(service)
    const description = document.createElement('p')
    container.appendChild(description)
    newItem.appendChild(container)

    img.setAttribute('src', item.status.icon)
    service.innerHTML = item.name
    description.innerHTML = item.status.text

    list.appendChild(newItem)
}

// fetch dos dados gerais do cloud da oracle e depois pode renderizar no método filterStatusOracle
fetch('https://ocistatus.oraclecloud.com/api/v2/status.json')
    .then((response) => response.json())
    .then((data) => filterStatusOracle(data))
    .catch((err) => console.log(err))

// lista que armazena os valores a serem buscados pelo fetch das regiões 
let searchLocations = ['Brazil Southeast (Vinhedo)', 'Brazil East (Sao Paulo)']

searchLocations.map(
    (searchLocation) => {
        // fetch que busca cada região na lista, filtra e depois pode renderizar no método filterServicesOracle
        fetch('https://ocistatus.oraclecloud.com/api/v2/components.json')
            .then((response) => response.json())
            .then((data) => filterComponentsOracle(data, searchLocation))
            .then((data) => filterServicesOracle(data))
            .catch((err) => console.log(err))
    }
)

fetch('https://ocistatus.oraclecloud.com/api/v2/components.json')
    .then((response) => response.json())
    .then((data) => filterPicpayServicesOracle(data, searchLocations))

