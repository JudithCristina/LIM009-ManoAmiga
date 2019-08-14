
//Función para acceder a usuarios  existentes por email y password//
export const emailLogIn = (email, password) => 
firebase.auth().signInWithEmailAndPassword(email, password);

//Función para acceder a usuarios por facebook//
export const authFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

//Función para acceder a usuarios por gmail//
export const authGmail = ()=>{
  const provider = new firebase.auth.GoogleAuthProvider()
  return firebase.auth().signInWithPopup(provider);
} 

//Función para cerrar sesión//
export const logOut = () => {
  return firebase.auth().signOut();
}

//Función para obtener al usuario//
export const getCurrenUser = () => {
	return firebase.auth().currentUser;
}