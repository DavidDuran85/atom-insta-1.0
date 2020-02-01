import tree from './tree'

function validateUser (){
	let user = tree.get('user')

	if( !user){
		window.location.href= '/'
	}
}
function forceToLogin () {

}

/*module.exports={
		validateUser: validateUser,
		forceToLogin: forceToLogin
}*/
export {
	validateUser
}