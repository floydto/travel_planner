const imgContainer = document.querySelector(".imgContainer");
const contentContainer = document.querySelector(".contentContainer");
// const attractionsName = document.querySelector('#placeLink').addEventListener("click",function(e){
//     return e.target.getAttribute("href")
// })
const search = new URLSearchParams(location.search);
const idSearch = search.get('id');



function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerText = html;
    return tmp.innerHTML;
}

//logout
window.onload = async function(){
    const searchParams = new URLSearchParams(window.location.search);
    const errMessage = searchParams.get('error');

    if(errMessage){
        const alertBox = document.createElement('div');
        alertBox.classList.add('alert','alert-danger');
        alertBox.textContent = errMessage;
        document.querySelector('#error-message').appendChild(alertBox);
    }else{
        document.querySelector('#error-message').innerHTML = "";
    }
    let login_res = await fetch('/currentUser')
    let login_json = await login_res.json()
    if(login_json.result== 'ok'){
        document.querySelector('#loginBtn').hidden = true
        document.querySelector('#signUpBtn').hidden =true
        document.querySelector('#itineraryMgt').hidden =false
        document.querySelector('#logoutBtn').hidden =false
        console.log(`currnet user: ${login_json.user}`)
    }else{
        console.log('currnet user: guest')  
}
}


async function loadAttractions() {
    // GET /places
    const res = await fetch(`/attractions?id=${idSearch}`); 
    const attractions = await res.json();
    console.log(attractions)
    imgContainer.innerHTML = "";

    let attractionHtml1=`
    <div>
        <div id="img_Place"><img src="${attractions[0].img_path}"></div>

    </div>
    `
    imgContainer.innerHTML += attractionHtml1;
    
    contentContainer.innerHTML="";

    let attractionHtml2=`
    <div id="placeContent">
    <div id="name_place">${attractions[0].name}</div>
    <div id="description_place">${attractions[0].description}</div>
    <div id="love_place"><i class="far fa-thumbs-up"></i> :${attractions[0].love}</div>
    </div>
    `
    contentContainer.innerHTML += attractionHtml2;


}
loadAttractions()