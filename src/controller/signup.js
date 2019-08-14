//Función para registrar nuevos usuarios//
export default (email, password) =>
 firebase.auth().createUserWithEmailAndPassword(email, password);
	