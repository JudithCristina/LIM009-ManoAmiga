
//Función para crear un documento y una colección//
export const createPost = (uid, userName,userPhoto, contentText, privacy, postImage = null) => {
  return firebase.firestore().collection('posts').add({
    userId: uid,
    user: userName,
    userPhoto: userPhoto,    
    content: contentText,
    likes: 0,
    date: new Date(),
    state: privacy, 
    image: postImage 
  })
} 

//Función para recuperar todos los documentos de una colección//
export const getAllPosts = (callback) => {
    firebase.firestore().collection('posts')
    .orderBy('date', 'desc')
    .onSnapshot((querySnapshot) => { //obtener actualizaciones en tiempo real//
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() })
        });
        callback(data);
      }); 
    }

 

// Función usando where() para buscar todos los documentos que cumplan una condición determinada y, luego usar get() para recuperar los resultado

export const getPublicPosts = (callback) => {
    firebase.firestore().collection('posts').where("state", "==", "public")
    .get()
    .then(function(querySnapshot) {
        let data = [];
        querySnapshot.forEach(function(doc) {
            data.push({ id: doc.id, ...doc.data() })
        });
        callback(data);
    })
}

//FUnción para editar los post//

export const updatePost = (idPost, content, privacy) => { 
    let refPost = firebase.firestore().collection('posts').doc(idPost);
    return refPost.update({
    content: content,
    state: privacy
    });
}

//FUnción para editar los comentarios del post//
 export const updatePostComments = (idPost,idComments, editComments) => {
   let refPostComments = firebase.firestore().collection('posts').doc(idPost).collection('comments').doc(idComments)
   return refPostComments.update({
     description : editComments
   })
  }

  //FUncion para eliminar post//
export const deletePost = (idPost) => firebase.firestore().collection('posts').doc(idPost).delete();

//Funcion para eliminar comentarios del post//
export const deletePostComment = (idPost,idComments) => firebase.firestore().collection('posts').doc(idPost).collection('comments').doc(idComments).delete();

export const uploadImage = (date, image) => {
    const postImageRef = firebase.storage().ref().child(`images/${date}-${image.name}`);
    const metadata = { contentType: image.type };
    return postImageRef.put(image, metadata)
    .then(snapshot => snapshot.ref.getDownloadURL());
}

export const addCommentPost = (uid, idPost, comment,userName,userPhoto) => {
  return firebase.firestore().collection('posts').doc(idPost).collection('comments').add({
    authorId: uid,
    description: comment,
    author:userName,
    authorPhoto: userPhoto,
    date: new Date(), 
    idPost: idPost
  })
}

export const getAllComentPost = (id, callback) => {
  return firebase.firestore().doc(`posts/${id}`).collection('comments')
    .orderBy('date', 'desc')
    .onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((post) => {
       data.push({id: post.id, ...post.data()})
      });
      callback(data)
    }); 
}


export const addLikeToPost = (id, user) => {
  return firebase.firestore().collection('posts').doc(id).collection('likes').add({
    userName: user,
    postId: id
  })
};

export const removeLikeToPost = (idPost, idLike) => {
  return firebase.firestore().collection('posts').doc(idPost).collection('likes').doc(idLike).delete();
  };

export const getAllLikesPost = (idPost, callback) => {
  return firebase.firestore().doc(`posts/${idPost}`).collection('likes')
    .onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((post) => {
       data.push({id: post.id, ...post.data()})
      });
      callback(data)
    }); 
}


export const createUsers = (email,uid,userName,userPhoto)=>{
  return firebase.firestore().collection('users').add({
    userId:uid,
    userName:userName,
    email:email,
    userPhoto:userPhoto,
    userOccupation: null 
    })
}


export const getUser =(callback)=>{
  return firebase.firestore().collection('users').where("email","==",true).
  get()
    .then(function(querySnapshot) {
      let data = [];
      querySnapshot.forEach(function(doc) {
          data.push({ id: doc.id, ...doc.data() })
      });
      callback(data);
  })

  } 

export const searchEmailUser= (email,uid,name,photo) =>{
  return firebase.firestore().collection("users").get().then(function(querySnapshot) {
    let aux=false;

    querySnapshot.forEach(function(doc) {
        if(doc.data().email==email){
          aux=true;
        
        }  
    });

    if(!aux){
      CreateUsers(email,uid,name,photo)

    }

  });
  }