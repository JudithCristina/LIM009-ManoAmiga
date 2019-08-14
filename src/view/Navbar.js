import { logOut, getCurrenUser } from "../controller/login.js";
import changeHash from './utils.js';

export const navBar = () => {
    //Carga de Header home
    const user = getCurrenUser();
    const header = document.createElement('header');
    header.classList.add('container-head', 'bg-green');
    const headerContent= `	  	    
        <div class="bg-green mobile-navbar">
          ${ user ? `<button id="btn-menu" class="border-box col-3 btn-menu bg-green" type="button"><i class="fa fa-bars" aria-hidden="true"></i>
          </button>`: ``}
          <div class="col-9 text-center">
            <img src="../assets/mano.png" alt="logo" class="btn-icon"/>
            <a class="title" href="#/home">Mano Amiga</a>
          </div>
          <div id='nav2'> </div> 
        </div>    
        <nav class="navbar bg-green">
          ${ user ? `<a href="#/profile"><strong>${user.displayName || user.email}</strong><img class="icon-rout-profile" src="../assets/sort-down.png"/></a>
          <a class="title" href="#/home"><img src="../assets/mano.png" alt="logo" class="btn-icon"/>Mano Amiga</a>
          <a href="#/login" id="btn-logout"><strong>Cerrar Sesión</strong></a>` : '<a class="title" href="#/home"><img src="../assets/mano.png" alt="logo" class="btn-icon"/>Mano Amiga</a><a class="links" href="#/signUp" title="link de registro">Registrarse</a>'} 
        </nav>`;
      header.innerHTML = headerContent;
      if (user) {
        const buttonLogOut = header.querySelector("#btn-logout");
        buttonLogOut.addEventListener("click", logoutOnClick);
        //const buttonUpdatePorfile=header.querySelector('#update-profile');
        //buttonUpdatePorfile.addEventListener('click',updateOnclickProfile);
        const btnNav = header.querySelector('#btn-menu');
      btnNav.addEventListener('click', ()=> {
        const nav2 =header.querySelector('#nav2');
        nav2.appendChild(nav())
      })
      }

    return header;
  }
  /*export const updateOnclickProfile =()=>{
    porfileUpdate()

  }*/
  const  nav = () => {
   let nav1 =
  ` <ul>
            <li><a href="#/home">Home</a></li>
            <li><a href="#/profile">Perfil</a></li>
            <li><a id='logout'>Cerrar Sesión</a></li>
        </ul>`
  const nav =document.createElement('nav')
  nav.innerHTML = nav1;
  const btnLogout=nav.querySelector('#logout');
  btnLogout.addEventListener('click', logoutOnClick);

  return nav;
  }


export const logoutOnClick = () => {
  logOut()
    .then((result) =>{
      changeHash('#/login')
    })
}