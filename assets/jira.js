localStorage.setItem("lastUpdateJira", new Date())

let timeJira = document.getElementById("jira-time")

function createElementJira(items, service) {
    // function that adds a item to the items list
    const list = document.querySelector('ul')

    items.map(
        (item) => {
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
            serviceName.innerHTML = service + `<span>${item.name}</span>`
            description.innerHTML = item.status.text

            list.appendChild(newItem)
        }
    )
    
}

function filterPicpayServicesJira(services) {

    let picpayStatus = true

    services.map(
        (service) => {
            fetch(`https://${service}.status.atlassian.com/api/v2/components.json`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.hasOwnProperty('components')) {
                        let componentsData = data.components.map(component => {
                            if (component.status !== 'operational') {
                                picpayStatus = false
                            }
                        })
                    } else {
                        console.log('Error while searching')
                    }
                })
                .catch((err) => console.log(err))
        }
    )

    let jiraStatus = document.querySelector("#jira .picpay span")
    let status = getStatusJira(picpayStatus)

    jiraStatus.querySelector('p').textContent = status.text
    jiraStatus.querySelector('img').setAttribute('src', status.icon)
}

function filterGeneralServicesJira(services) {

    let picpayStatus = true

    services.map(
        (service) => {
            fetch(`https://${service}.status.atlassian.com/api/v2/components.json`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.hasOwnProperty('components')) {
                        let componentsData = data.components.map(component => {
                            if (component.status !== 'operational') {
                                picpayStatus = false
                            }
                        })
                    } else {
                        console.log('Error while searching')
                    }
                })
                .catch((err) => console.log(err))
        }
    )

    let jiraStatus = document.querySelector("#jira .general span")
    let status = getStatusJira(picpayStatus)

    jiraStatus.querySelector('p').textContent = status.text
    jiraStatus.querySelector('img').setAttribute('src', status.icon)
}

function getStatusJira(status) {
    if (status === 'operational' || status === true) {
        return { text: 'All Clean', icon: './assets/img/check-circle.svg' }
    } else {
        return { text: 'Something went wrong', icon: './assets/img/x-circle.svg' }
    }
}

function lastUpdate() {
    let data = localStorage.getItem("lastUpdateJira")
    data = new Date(data)

    var differenceValue = (data.getTime() - new Date().getTime()) / 1000;
    differenceValue /= 60;
    let result = Math.abs(Math.round(differenceValue))
    
    timeJira.innerHTML = `Last update: ${result} ${result == 1 ? 'minutes' : 'minute'} ago` 

    localStorage.setItem("lastUpdateOracle", new Date())
}


const servicesJira = ['jira-software', 'jira-service-management', 'jira-work-management', 'jira-product-discovery', 'confluence', 'jira-align']
const picpayServicesJira = ['jira-software','jira-service-management','confluence', 'jira-align']

function loaDataJira() {
    filterPicpayServicesJira(picpayServicesJira)
    filterGeneralServicesJira(servicesJira)

    servicesJira.map(
        (service) => {
            fetch(`https://${service}.status.atlassian.com/api/v2/components.json`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.hasOwnProperty('components')) {
                        let componentsData = data.components.map(component => {
                            return {
                                name: component.name,
                                status: getStatusJira(component.status)
                            }
                        })
                        createElementJira(componentsData, service)
                    } else {
                        console.log('Error while searching')
                    }
                })
                .catch((err) => console.log(err))
        }
    )
}

setInterval(() => {
    loaDataJira()
    lastUpdate()
}, 2000)