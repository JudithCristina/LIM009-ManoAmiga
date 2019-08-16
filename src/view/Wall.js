// importando funciones que se van a usar
import { createPost, getAllPosts, getPublicPosts, updatePost, deletePost, uploadImage, addLikeToPost, removeLikeToPost, getAllLikesPost, addCommentPost, getAllComentPost, deletePostComment, updatePostComments} from '../controller/wall.js';
import { getCurrenUser } from '../controller/login.js';
import {searchEmailUser} from '../controller/wall.js'
import changeHash from './utils.js';

let postImage;
// creando funcion home nuestra primera vista con su parametro post
export const home = (posts) => {
	// invocando la funcion getCurrentUser para obtener la informacion del perfil del usuario actualmente activo
	let user = getCurrenUser();
	// invocando la funcion para poder crear la coleccion user en firebase
	searchEmailUser(user.email,user.uid,user.displayName,user.photoURL);
	let content;
	// condicional si usuario esta logeado muestrame la parte del perfil del usuario
  if (user) {
	content = `
	<section id="profile-container" class="profile border-box">
        <div class="container-background">
			<img class="background-profile" src="../assets/coffe-code.jpg"/>
        </div>
        <div class="container-user">
            ${user.photoURL === null ? `<img class="img-user" src="../assets/perfil-email.jpg"/>` : `<img class="img-user" src="${user.photoURL}"/>`}
            ${user.displayName === null ? `<p id="inf-user" class="margin-name"><strong> ${user.email}</strong><p>`:`<p id="inf-user"  class="margin-name"><strong>${user.displayName}</strong><p>` }  
        </div>
	</section>
	<section class="posts">
	<div id="post-list" class="post-list post-article border-box"></div>
	</section>`;
	
  } else {
		// si no esta logeado muestrame solo los post publicos y añadele la opcion de iniciar sesion
  	content = `
  	<a href="#/login" title="link de iniciar sesion">Iniciar Sesión</a>
	<section class="posts post-list">
	<div id="post-list" class="post-article border-box"></div>
	</section>`;
}
// crea el elemento main que contiene a todo el contenido
 const contentContainer = document.createElement('main');
 // añadiendo clases a la elemento content container
	contentContainer.classList.add('flex-container', 'border-box', 'main-container');
	contentContainer.innerHTML = content;
		const wallAll = contentContainer.querySelector('#post-list');
		// si el usuario logeado llamame a wallall y agregame un nuevo nodo llamando a la funcion createPostTemplate
		if (user) {wallAll.appendChild(createPostTemplate())};
		// recorre el post que contiene todos los post y creame creame llamando la funcion postListTemplate
    posts.forEach((post) => {
      wallAll.appendChild(postListTemplate(post));    
		});
		// y devuelve el contendor con todos los post
	return contentContainer;
}

// creando funcion que crea el template de los post
export const createPostTemplate = () => {
	const createPostContainer = document.createElement('div');
	createPostContainer.classList.add('post-article', 'post-box', 'border-post');
	createPostContainer.setAttribute('id', 'create-post-container');
	const createPostForm = `
	<form>
	<div class="col-12">
	  <select id="post-privacy-select" class="block select bg-green color-white border-none">
	  <option value="public">Public</option>
	  <option value="private">Private</option>
	  </select>
	  </div>
	  <input id="post-content-input" class="block post-input border" type="text" name="post-content" placeholder="¿Qué quieres compartir?" />
	  <div class="btn-post-input">
	  <img id="btn-upload-image" class="block border-box btn-icon-post bg-green" src="../assets/image.png" alt="subir-imagen" title="subir imagen" />
	  <button id="create-post-btn" type="submit" class="block btn-share bg-green color-white">Compartir</button>
	  </div>
	  <input id="input-file" class="none" type="file" accept="image/*" />
	</form>`;
	createPostContainer.innerHTML = createPostForm;
	// Carga de imagen a post
	postImage = createPostContainer.querySelector('#input-file');
	const uploadImageBtn = createPostContainer.querySelector('#btn-upload-image');
	uploadImageBtn.addEventListener('click', () => {
		postImage.classList.remove('none');
	});    
	const createPostBtn = createPostContainer.querySelector('#create-post-btn');
    createPostBtn.addEventListener('click', createPostOnClick);
	return createPostContainer;
}

export const createPostOnClick = (event) => {
	event.preventDefault();
	const formElem = event.target.closest('form')
	const postDescription = formElem.querySelector('#post-content-input').value;
	const postPrivacy = formElem.querySelector('#post-privacy-select').value;
	const user = getCurrenUser();
	if (user && postDescription !== '') {
		document.getElementById('post-list').innerHTML = '';
		if (postImage.files[0] == undefined) {
		createPost(user.uid, user.displayName || user.email , user.photoURL, postDescription, postPrivacy)
		.then((response) => getAllPosts(postListTemplate));
	    } else {
	    	const date = new Date().toString();
	    	console.log(date);
	    	uploadImage(date, postImage.files[0])
	    	.then((url) => createPost(user.uid, user.displayName, user.photoURL,postDescription, postPrivacy, url))
	    	.then((response) => getAllPosts(postListTemplate));
	    }
		formElem.querySelector('#post-content-input').value = '';
	}

}

export const postListTemplate = (postObject) => {
	const user = getCurrenUser();

	const postsList = 
				`<div class="post-article post-head border-box bg-green">
					<div class="col-2">
					${postObject.userPhoto === null ? `<img class="round-image text-center" src="../assets/perfil-email.jpg"/>` : `<img class="round-image clear" src="${postObject.userPhoto}"/>`}
					</div> 
					${postObject.user === null ? `<p class="col-9">Publicado por <strong>${user.email}</strong></p>`:`<p class="col-9">Publicado por  <strong>${postObject.user} </strong></p>` } 
					<div class="col-1">
					${(user && user.uid === postObject.userId) ? `<img id="btn-delete-${postObject.id}" class="block border-box auto btn-delete bg-green" src="../assets/close.png" alt="eliminar-post" />`: ''}
					</div>
				</div>
				<div class="post-content clear">
				  <textarea id="post-edit-${postObject.id}" class="border-box post-article textarea border-none" readOnly=true>${postObject.content}</textarea>
				  ${(postObject.image !== undefined && postObject.image !== null) ? `<img class="image-post" src="${postObject.image}" alt="post-image" title="post image" />` : ``}
				  <span id="likes-count-${postObject.id}" class="color-black registry">${postObject.likes}</span>
				  </div>
        		<div class="post-article bg-light-green post-footer border-box">
				  <img id="btnLike-${postObject.id}" class="border-box btn-icon-post bg-green" src="../assets/heart.png" alt="likes" title="likes" />
				  ${(user && user.uid === postObject.userId) ? `<img id="btn-edit-${postObject.id}" class="border-box btn-icon btn-icon-post bg-green" src="../assets/paper-plane.png" alt="editar-post" />`: ''}
				  ${(user && user.uid === postObject.userId) ? `<select id="edit-privacy-${postObject.id}" class="select bg-green color-white border-none hide" disabled="true">
				  	${(postObject.state === 'public') ? `<option value="public">Public</option><option value="private">Private</option>` : `<option value="private">Private</option><option value="public">Public</option>`}
						</select>` : ``}
				</div>
				<div class="border-box post-article post-comment border-bottom">
        <div class="col-10">
				${(user) ? `<input id="comment-input" class="border-box input-comment bg-white border" type="text" placeholder="Escribe tu comentario" />` : '' }
				</div>
				<div class="col-2">
				${(user) ? ` <img id="post-comments-${postObject.id}" class="border-box btn-icon-post bg-green btn-icon-center " src="../assets/comments.png" alt="list-comments" />` : '' }
				</div>
				</div>
				<div id="comment-content-${postObject.id}" class="border-box post-article">
				</div>`;
	const article = document.createElement('article');
	article.setAttribute('id', postObject.id);
	article.classList.add('post-box', 'border');
	article.innerHTML = postsList;
	if (user && user.uid === postObject.userId) {
	  const deleteBtn = article.querySelector(`#btn-delete-${postObject.id}`);
	  deleteBtn.addEventListener('click', () => {
		deletePost(postObject.id)
	  });
	  const editBtn = article.querySelector(`#btn-edit-${postObject.id}`);
  	  const textArea = article.querySelector(`#post-edit-${postObject.id}`);
  	  const select = article.querySelector(`#edit-privacy-${postObject.id}`);
  	  editBtn.addEventListener('click', () => {
		return toggleDisableTextarea(textArea, select, postObject, editBtn);
      });
	}
	// show likes total in span
	const btnLike = article.querySelector(`#btnLike-${postObject.id}`);
	let userLikes;
	getAllLikesPost(postObject.id, (likes) => {
    	const likesCounter = likes.length;
    	const likesSpan = article.querySelector(`#likes-count-${postObject.id}`);
    	userLikes = likes.find((comment) => comment.userName === user.email);
		(userLikes !== undefined) ? btnLike.src = '../assets/heart.png' : btnLike.src = '../assets/heart-empty.png';
			likesSpan.innerHTML = (userLikes !== undefined) ?  (likesCounter===1) ?  `a ti te encanta` :  `a ti y a ${likesCounter -1} personas le encanta` : (likesCounter===0)? "":`a ${likesCounter} personas le encanta`;
    });

    btnLike.addEventListener('click', () => {
    	if (userLikes === undefined) {
    	  addLikeToPost(postObject.id, user.email)
    	  .then((response) => getAllLikesPost(postObject.id, (likes) => {
    	  	btnLike.src = '../assets/heart.png';
    	    const likesCounter = likes.length;
    	    const likesSpan = article.querySelector(`#likes-count-${postObject.id}`);
			userLikes = likes.find((comment) => comment.userName === user.email);
			likesSpan.innerHTML = likesCounter===1 ?  `a ti te encanta` :  `a ti y a ${likesCounter -1} personas le encanta`;
            })
    	  );	
    	}  else {
    	  removeLikeToPost(postObject.id, userLikes.id)
    	  .then((response) => getAllLikesPost(postObject.id, (likes) => {
    	  	btnLike.src = '../assets/heart-empty.png';
    	    const likesCounter = likes.length;
    	    const likesSpan = article.querySelector(`#likes-count-${postObject.id}`);
    	    likesSpan.innerHTML =likesCounter===0 ? "":`a ${likesCounter} personas le encanta`;
    	    userLikes = undefined;
            })
    	  );
    	}
		
	});

	const commentContainer = article.querySelector(`#comment-content-${postObject.id}`);
	getAllComentPost(postObject.id, (comments) => {
		commentContainer.innerHTML = '';
		comments.forEach(comment => {
			commentContainer.appendChild(commentListTemplate(comment,postObject))
		});
	})
	if (user) {
	  const commentsBtn = article.querySelector(`#post-comments-${postObject.id}`);
	  const comment = article.querySelector('#comment-input');
	  commentsBtn.addEventListener('click', () => {
	  	if (comment.value !== '') {
	  	  addCommentPost(user.uid, postObject.id, comment.value, user.displayName, user.photoURL)
	  	  .then((response) => comment.value = '');
        }
      });
	}
	
	return article;
}

const commentListTemplate = (commentsObject) => {
	const user = getCurrenUser();
	const commentList = `
	<div class="col-1">
	${commentsObject.authorPhoto === null ? `<img class="round-image text-center" src="../assets/perfil-email.jpg"/>` : `<img class="round-image clear" src="${commentsObject.authorPhoto}"/>`}
	</div>
	<div class="col-9"> 
	<p>Comentado por <strong>${commentsObject.author}</strong>:</p>
	</div>
	<div class="col-1"> 
	${(user.uid === commentsObject.authorId) ? `<img id="btn-edit-${commentsObject.id}" class="border-box btn-icon btn-icon-post" src="../assets/paper-plane.png" alt="editar-post" />`: ''}
	</div>
  <div class="col-1"> 
	${(user.uid === commentsObject.authorId) ? `<img id="btn-delete-${commentsObject.id}" class="border-box btn-icon-post " src="../assets/close.png" alt="eliminar-post" />`: ''}
	</div>
	<div class="post-article">
	<textarea id="comment-${commentsObject.id}" class=" clear block auto border-box textarea-comment bg-white border" readOnly="true">${commentsObject.description}</textarea>
	</div>
	`;
	const article = document.createElement('article');
	article.setAttribute('id', commentsObject.id);
	article.classList.add('post-article', 'border-bottom', 'border-box');
	article.innerHTML = commentList;
	
	if (user.uid === commentsObject.authorId) {
		const deleteBtn = article.querySelector(`#btn-delete-${commentsObject.id}`);
		deleteBtn.addEventListener('click', () => {
			deletePostComment(commentsObject.idPost, commentsObject.id)
		});
		const editBtn = article.querySelector(`#btn-edit-${commentsObject.id}`);
  	    const textArea = article.querySelector(`#comment-${commentsObject.id}`);
  	    editBtn.addEventListener('click', () => {
		  return toggleDisableTextareaComments(textArea, commentsObject, editBtn);
        });
    }

	return article;
}


export const toggleDisableTextarea = (textArea, select, postObject, btn) => {
	if (textArea.readOnly && select.disabled) {
		btn.src = "../assets/save.png";
		textArea.readOnly = false;
		select.disabled = false;
		document.getElementById(`edit-privacy-${postObject.id}`).classList.add("show");
		document.getElementById(`edit-privacy-${postObject.id}`).classList.remove("hide");
	} else {
		btn.src = "../assets/paper-plane.png";
		textArea.readOnly = true;
		select.disabled = true;
		document.getElementById(`edit-privacy-${postObject.id}`).classList.add("hide");
		document.getElementById(`edit-privacy-${postObject.id}`).classList.remove("show");

		return updatePost(postObject.id, textArea.value, select.value)
	}
}

export const toggleDisableTextareaComments = (textArea, commentsObject, btn) => {
	if (textArea.readOnly) {
		btn.src = "../assets/save.png";
		textArea.readOnly = false;
	} else {
		btn.src = "../assets/paper-plane.png";
		textArea.readOnly = true;
		return updatePostComments(commentsObject.id, commentsObject.id, textArea.value)
	}
}
