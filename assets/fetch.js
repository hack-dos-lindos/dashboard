// ORACLE

// esse método pode ser usado para renderizar o status geral da Cloud da Oracle no lugar dos console.log()
function filterStatus(data) {
    // página é a OCI 
    let page = data['page']['name']
    // status é se está funcionando ou não
    let rawStatus = data['status']['description']
    let oracleStatus = document.querySelector
        ("#oracle-general-status")
    let status = getStatus(rawStatus)

    oracleStatus.querySelector('p').textContent = status.text
    oracleStatus.querySelector('img').setAttribute('src', status.icon)
}

// esse método filtra apenas os dados da cidade buscada no locationName
function filterComponents(data, locationName) {
    let reports = data['regionHealthReports']

    return reports.filter(
        (report) => locationName === report['regionName']
    )
}

// esse método pode ser usado para renderizar o status da cidade buscada no método filter components no lugar dos console.log()
function filterServices(data) {

    let services = data[0]['serviceHealthReports']

    services.map(
        (service) => {
            let serviceName = service['serviceName']
            let serviceStatus = service['serviceStatus']
            console.log(serviceName)
            console.log(serviceStatus)
        }

    )

}

function getStatus(status) {
    if (status === 'Normal Performance') {
        return { text: 'All Clean', icon: './check-circle.svg' }
    } else {
        return { text: 'Something went wrong', icon: './x-circle.svg' }
    }
}

// fetch dos dados gerais do cloud da oracle e depois pode renderizar no método filterStatus
fetch('https://ocistatus.oraclecloud.com/api/v2/status.json')
    .then((response) => response.json())
    .then((data) => filterStatus(data))
    .catch((err) => console.log(err))

// lista que armazena os valores a serem buscados pelo fetch das regiões 
let searchLocations = ['Brazil Southeast (Vinhedo)', 'Brazil East (Sao Paulo)']

searchLocations.map(
    (searchLocation) => {
        // fetch que busca cada região na lista, filtra e depois pode renderizar no método filterServices
        fetch('https://ocistatus.oraclecloud.com/api/v2/components.json')
            .then((response) => response.json())
            .then((data) => filterComponents(data, searchLocation))
            .then((data) => filterServices(data))
            .catch((err) => console.log(err))
    }
)


