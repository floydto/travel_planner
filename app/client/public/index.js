//const mostCommentedContainer = document.querySelector(".mostCommentedRoutes");
//const trendingPlacesContainer = document.querySelector(".trendingPlaces");
const inner1Container = document.querySelector(".inner1"); //for trending places
const hotJourneyContainer = document.querySelector(".hotJourney");

function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerText = html;
    return tmp.innerHTML;
}

//logout 
window.onload = async function () {
    const searchParams = new URLSearchParams(window.location.search);
    const errMessage = searchParams.get('error');

    if (errMessage) {
        const alertBox = document.createElement('div');
        alertBox.classList.add('alert', 'alert-danger');
        alertBox.textContent = errMessage;
        document.querySelector('#error-message').appendChild(alertBox);
    } else {
        document.querySelector('#error-message').innerHTML = "";
    }
    let login_res = await fetch('/currentUser')
    let login_json = await login_res.json()
    if (login_json.result == 'ok') {
        document.querySelector('#loginBtn').hidden = true
        document.querySelector('#signUpBtn').hidden = true
        document.querySelector('#itineraryMgt').hidden = false
        document.querySelector('#logoutBtn').hidden = false
        console.log(`current user: ${login_json.user}`)
    } else {
        console.log('current user: guest')
    }
}


//create hot journey routes////////////////////////////////////////////////////////

async function loadHotJourney() {
    // GET /routes
    const res = await fetch("/itinerary/hot");
    const routes = await res.json();
    // console.log("this is routes:", routes)
    hotJourneyContainer.innerHTML = "";

    for (let route of routes) {
        let routeHtml = `
    <div class="col-md-4">
    <div class="card">
    `
        if (route.img_path != null) {
            routeHtml += `
        <img
        class="card-img-top"
        src="${route.img_path}"
        alt="Card image cap"
        />
        `
            routeHtml += `
        <div class="card-body">
        <p class="card-text">${route.title}</p>
        <div class="itineraryLike"><i class="fab fa-gratipay"></i>:${route.love}</div>
        <div class="userName">${route.username}</div>
        </div>
        </div>
        </div>
        `
        } else {
            routeHtml += `
        <img
        class="card-img-top"
        src="img/Temp.jpg"
        alt="Card image cap"
        />
        `
            routeHtml += `
        <div class="card-body"> 
        <p class="card-text">${route.title}</p>
        <div class="itineraryLike"><i class="fab fa-gratipay"></i>:${route.love}</div>
        <div class="userName">${route.username}</div>
        </div>
        </div>
        </div>
        `
        }
        // routeHtml +=`
        // <div class="card-body">
        // <p class="card-text">${route.title}</p>
        // <div class="itineraryLike"><i class="fab fa-gratipay"></i>:${route.love}</div>
        // <div class="userName">${route.username}</div>
        // </div>
        // </div>
        // </div>
        // `
        hotJourneyContainer.innerHTML += routeHtml;
        // console.log("loop complete")
        // console.log(hotJourneyContainer.innerHTML)
    }
}

loadHotJourney()

//create trending places routes////////////////////////////////////////////////////////


async function loadTrendingPlaces() {
    // GET /places
    const res = await fetch("/places");
    const places = await res.json();
    inner1Container.innerHTML = "";
    console.log("show places:", places)


    let placeHtml = `
    <div
    id="carouselExampleFade"
    class="carousel slide carousel-fade"
    data-ride="carousel">
    <div class="carousel-inner">
    `
    for (let i = 0; i < places.length; i++) {
        if (i == 0) {
            placeHtml += `
            <div class="carousel-item active">
            `
            if (places[i].img_path != null) {
                placeHtml += `
                    <a id="placeLink" href="/attractions.html?id=${places[i].id}">
                        <img
                        src="${places[i].img_path}"
                        class="d-block w-100"
                        alt="..."/>
                    </a>
                    <div class="carousel-caption d-md-block textTotal">
                    <h2 class="placeTitle">${places[i].name}</h2>
                    <div class="descriptionText">${places[i].description}</div>
                    <div class="placeLike"><i class="far fa-thumbs-up"></i> : ${places[i].love}</div>
                    </div>
                </div>
                `
            } else {
                placeHtml += `
                <a id="placeLink" href="/attractions.html?id=${places[i].id}">
                    <img
                    src="img/Temp.jpg"
                    class="d-block w-100"
                    alt="..."/>
                </a>
                </div>
                `
            }
        } else {
            placeHtml += `
            <div class="carousel-item">
            `
            if (places[i].img_path != null) {
                placeHtml += `
                <a id="placeLink" href="/attractions.html?id=${places[i].id}">    
                    <img
                    src="${places[i].img_path}"
                    class="d-block w-100"
                    alt="..."/>
                </a>
                    <div class="carousel-caption d-md-block textTotal">
                    <h2 class="placeTitle">${places[i].name}</h2>
                    <div class="descriptionText">${places[i].description}</div>
                    <div class="placeLike"><i class="far fa-thumbs-up"></i> : ${places[i].love}</div>
                    </div>
                </div>
                `
            } else {
                placeHtml += `
                <a id="placeLink" href="/attractions.html?id=${places[i].id}">
                    <img
                    src="img/Temp.jpg"
                    class="d-block w-100"
                    alt="..."/>
                </a>
                </div>
                `
            }
        }
    }
    placeHtml += `
    </div>
    <a
        class="carousel-control-prev"
        href="#carouselExampleFade"
        role="button"
        data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
    </a>
    <a
        class="carousel-control-next"
        href="#carouselExampleFade"
        role="button"
        data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
    </a>
    </div>
    `
    inner1Container.innerHTML += placeHtml;

}

loadTrendingPlaces();

