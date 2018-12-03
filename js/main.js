var filmForm = document.getElementById('filmForm');
var searchMessage = document.querySelector('.film-search__message');
var searchResults = document.querySelector('.film-search__results');
var detailsButton = document.querySelectorAll('.details-button');
var newUserForm = document.getElementById('newUserForm');
var sessionWrapper = document.querySelector('.session-wrapper');
var favMovieIdentifiers = [];
var favList = document.querySelector('.fav-list');
var isUser = false;
var userName = sessionStorage.getItem('user');
var userFavs = [];

//DETECTAR SI USUARIO ESTÁ REGISTRADO
function checkUser(){
    if(!!sessionStorage.getItem('user') && !!sessionStorage.getItem('password')){
        isUser = true;
    } else{
        isUser = false;
        favMovieIdentifiers = [];
    }
}

checkUser();

//INICIALIZAR FAVORITOS
function favInit(){
    if(!!JSON.parse(localStorage.getItem(''+ userName +'Favs'))){
        userFavs = JSON.parse(localStorage.getItem(''+ userName +'Favs'));

        for (let i = 0; i < userFavs.length; i++) {
            favMovieIdentifiers = favMovieIdentifiers.concat(userFavs[i].imdbID);
        }
    }
}

favInit();


if(!!filmForm){
    filmForm.addEventListener('submit', function(e){
        e.preventDefault();

        // FORMATO TITULO
        var filmTitleOriginal = document.getElementById('movieTitle').value;
        var filmTitle = document.getElementById('movieTitle').value;
        filmTitle = filmTitle.toLowerCase();
        filmTitle = filmTitle.replace(/ /g, '+');
    
        // RECOGER DATOS
        fetch('https://www.omdbapi.com/?s='+ filmTitle +'&apikey=f12ba140&').then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);

            // MOSTRAR MENSAJE ERROR
            if (!!data.Error){
                searchMessage.innerHTML = 'Error: ' + data.Error;
                searchMessage.classList.remove('d-none');
                searchMessage.classList.add('text-white');
                searchResults.classList.add('d-none');
            } else {
                var movies = data.Search;
                var result = '';
                searchMessage.classList.remove('text-white');
                
                // CREAR UN LIST ITEM POR CADA PELÍCULA
                for (var i = 0; i < movies.length; i++) {
                    if (!favMovieIdentifiers.includes(movies[i].imdbID)){
                        result = result.concat('<li class="film-item col-12 col-md-6 col d-flex align-items-center mb-3" data-id="'+ movies[i].imdbID +'"><img src="'+ movies[i].Poster +'"><div><p>'+ movies[i].Title +' ('+ movies[i].Year +')</p><button class="details-button btn btn-primary">Ver detalle</button><img src="./img/star.png" alt="add to favourites" class="fav-icon fav-icon--empty ml-3"></div></li>');
                    } else {
                        result = result.concat('<li class="film-item col-12 col-md-6 col d-flex align-items-center mb-3" data-id="'+ movies[i].imdbID +'"><img src="'+ movies[i].Poster +'"><div><p>'+ movies[i].Title +' ('+ movies[i].Year +')</p><button class="details-button btn btn-primary">Ver detalle</button><img src="./img/star-full.png" alt="is favourite" class="fav-icon fav-icon--full ml-3"></div></li>');
                    }
                }
                searchResults.innerHTML = result;
                searchResults.classList.remove('d-none');
                searchMessage.innerHTML = 'Showing results for "'+ filmTitleOriginal +'"';
                searchMessage.classList.remove('d-none');
    
                // RECOGER ID DE LA PELÍCULA A MOSTRAR
                for (let i = 0; i < document.querySelectorAll('.details-button').length; i++) {
                    document.querySelectorAll('.details-button')[i].addEventListener('click', function(){
                        var filmItemID = this.parentElement.parentElement.dataset.id;
                        filmDetails(filmItemID);
                    })
                }

                //HACER FAVORITO
                if(!!isUser){
                    determineFav();
                 } 

            }
        }).catch(function (err) {
            document.querySelector('.film-search__message').innerHTML = err;
        })
        
        // QUITAR TÍTULO DEL INPUT UNA VEZ BUSCADO
        document.getElementById('filmForm').reset();
    })
}


// GUARDAR EL ID EN sessionStorage Y REDIRIGIR A LA PÁGINA DETALLE DE LA PELÍCULA
function filmDetails(filmItemID) {
    sessionStorage.setItem('filmID', filmItemID);
    window.location = 'film-detail.html';
    return false;
}


//GENERAR PANTALLA CON DATOS DE LA PELÍCULA BUSCADA
function showFilmDetails() {
    var filmID = sessionStorage.getItem('filmID');

    fetch('https://www.omdbapi.com/?i='+ filmID +'&apikey=f12ba140&').then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);

        document.querySelector('h1').innerText = data.Title;

        document.querySelector('.release').innerText = data.Year;

        document.querySelector('.main-img').src = data.Poster;

        document.querySelector('.actors__slot').innerText = data.Actors;

        document.querySelector('.director__slot').innerText = data.Director;

        document.querySelector('.genre__slot').innerText = data.Genre;

        document.querySelector('.plot__slot').innerText = data.Plot;

        document.querySelector('.rating__slot').innerText = data.imdbRating;

        document.querySelector('.country__slot').innerText = data.Country;

        document.querySelector('.language__slot').innerText = data.Language;

        document.querySelector('.id-storer').dataset.id = data.imdbID;


        

        if(!!isUser){
            var alreadyFav = false;

            for (let i = 0; i < userFavs.length; i++) {
                if (!alreadyFav){
                    if (userFavs[i].imdbID === data.imdbID){
                        alreadyFav = true;
                    }
                }
            }

            if (!!alreadyFav){
                if(!!document.querySelector('.detail__fav-icon')){
                    document.querySelector('.detail__fav-icon').setAttribute('src', './img/star-full.png');
                    document.querySelector('.detail__fav-icon').setAttribute('alt', 'is favourite');
                    document.querySelector('.detail__fav-icon').classList.add('fav-icon--full');
                    document.querySelector('.detail__fav-icon').classList.remove('fav-icon--empty');
                }
            } 
            
            determineFav();

        }

    }).catch(function (err) {
        console.log(err);
    })
}

//CERRAR PANTALLA DE DETALLE
if(!!document.querySelector('.close-detail')){
    for (let i = 0; i < document.querySelectorAll('.close-detail').length; i++) {
        document.querySelectorAll('.close-detail')[i].addEventListener('click', function() {
            window.location = 'index.html';
        })
    }
}

//REGISTRAR USUARIO
if(!!newUserForm){
    newUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var userValue = this.querySelector('#user').value;
        var passwordValue = this.querySelector('#password').value;

        if(!userValue || !passwordValue){
            this.querySelector('.user-form-error').classList.add('d-block');
            this.querySelector('.user-form-error').classList.add('d-none');
        } else{
            sessionStorage.setItem('user', userValue);
            sessionStorage.setItem('password', passwordValue);
            window.location = 'index.html';
            checkUser();
        }
    })
}

//MOSTRAR LOGIN O DATOS DEL USUARIO
if(!!sessionWrapper){
    if(!!isUser){
        sessionWrapper.querySelector('.login-form').classList.add('d-none');
        sessionWrapper.querySelector('.login-form').classList.remove('d-lg-block');
        sessionWrapper.querySelector('.login-form').classList.remove('d-flex');
        sessionWrapper.querySelector('.user-data').classList.add('d-flex');
        sessionWrapper.querySelector('.user-data').classList.remove('d-none');
        sessionWrapper.querySelector('.user-data__name').innerText = userName;
    }
}

//MOSTRAR MENÚ ACCEDER MÓVIL
document.querySelector('.mobile-access').addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector('.login-form__inputs').classList.toggle('d-none');
})

//MENSAJE ERROR SI USUARIO NO REGISTRADO
sessionWrapper.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    if (window.innerWidth > 992){
        sessionWrapper.querySelector('.desktop-login-error').classList.remove('d-lg-none');
    } else{
        sessionWrapper.querySelector('.mobile-login-error').classList.remove('d-none');
    }
})

//MOSTRAR PELÍCULAS FAVORITAS
function showFavs() {
    var favRender = '';
    if (!!favList){
        if(!!isUser){
            if(userFavs.length < 1){
                favList.innerHTML = '<p class="col">No favourites added yet</p>';
            } else{
                for (let i = 0; i < userFavs.length; i++) {
                    favRender = favRender.concat('<li class="film-item col-12 col-md-4 d-flex align-items-center mb-3" data-id="'+ userFavs[i].imdbID +'"><img src="'+ userFavs[i].Poster +'"><div><p>'+ userFavs[i].Title +' ('+ userFavs[i].Year +')</p><button class="details-button btn btn-primary">Ver detalle</button></div></li>');

                    favList.innerHTML = favRender;
                }
                for (let j = 0; j < document.querySelectorAll('.details-button').length; j++) {
                    document.querySelectorAll('.details-button')[j].addEventListener('click', function(){
                        var filmItemID = this.parentElement.parentElement.dataset.id;
                        filmDetails(filmItemID);
                    })
                }
            }
        } else {
            favList.innerHTML = '<p class="col">You must be logged in to save favourites</p>';
        }
    }
}



//ALTERNAR FAVORITOS
function determineFav(){
    var favIcon = document.querySelectorAll('.fav-icon');
    if (favIcon.length > 0){
        for (let i = 0; i < favIcon.length; i++) {
            favIcon[i].addEventListener('click', function(e){
                var thisID = e.target.parentElement.parentElement.dataset.id;

                if(e.target.classList.contains('fav-icon--empty')){
                    e.target.setAttribute('src', './img/star-full.png');
                    e.target.setAttribute('alt', 'is favourite');
                    e.target.classList.add('fav-icon--full');
                    e.target.classList.remove('fav-icon--empty');


                    fetch('https://www.omdbapi.com/?i='+ thisID +'&apikey=f12ba140&').then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        if(!!data.imdbID){
                            var alreadyFav = false;

                            for (let i = 0; i < userFavs.length; i++) {
                                if (!alreadyFav){
                                    if (userFavs[i].imdbID === data.imdbID){
                                        alreadyFav = true;
                                    }
                                }
                            }
                            if(!alreadyFav){
                                userFavs = userFavs.concat(data);
                                localStorage.setItem(''+ userName +'Favs', JSON.stringify(userFavs));
                            }

                            favMovieIdentifiers = favMovieIdentifiers.concat(data.imdbID);

                            return showFavs();
                        }
                    })


                } else if (e.target.classList.contains('fav-icon--full')){
                    e.target.setAttribute('src', './img/star.png');
                    e.target.setAttribute('alt', 'add to favourites');
                    e.target.classList.add('fav-icon--empty');
                    e.target.classList.remove('fav-icon--full');

                    var index = favMovieIdentifiers.indexOf(thisID);

                    if (index > -1){
                        favMovieIdentifiers.splice(index, 1);
                        userFavs.splice(index, 1);
                        localStorage.setItem(''+ userName +'Favs', JSON.stringify(userFavs));
                    }
                        
                    return showFavs();
                }
            })
        }
    }
}




