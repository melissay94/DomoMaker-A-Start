const handleLogin = (e) => {
	e.preventDefault();

	$("#domoMessage").animate({width:'hide'}, 350);

	if($("#user").val() == '' || $('#pass').val() == '') {
		handleError("Rawr, username or password not found");
		return false;
	}

	console.log($("input[name=_csrf]").val());

	sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

	return false;
};

const handleSignup = (e) => {
	e.preventDefault();

	$("#domoMessage").animate({width:'hide'}, 350);

	if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
		handleError("Rawr, you need to fill out all fields");
		return false;
	}

	if($("#pass").val() !== $("#pass2").val()) {
		handleError("Rawr, your passwords don't match");
		return false;
	}

	sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

	return false;
};

// Oh boy react
const renderLogin = function() {
	return (
		<form id="loginForm" name="loginForm"
			onSubmit={this.handleSubmit}
			action="/login"
			method="POST"
			className="mainForm"
		>
			<label htmlFor="username">Username: </label>
			<input id="user" type="text" name="username" placeholder="username" />
			<label htmlFor="pass">Password: </label>
			<input id="pass" type="password" name="pass" placeholder="password" />
			<input type="hidden" name="_csrf" value={this.props.csrf} />
			<input className="formSubmit" type="submit" value="Sign in" />
		</form>
	);
};

const renderSignup = function() {
	return (
		<form id="signupForm"
			name="signupForm"
			onSubmit={this.handleSubmit}
			action="/signup"
			method="POST"
			className="mainForm"
		>
			<label htmlFor="username">Username: </label>
			<input id="user" type="text" name="username" placeholder="username"/>
			<label htmlFor="pass">Password: </label>
			<input id="pass" type="password" name="pass" placeholder="password" />
			<label htmlFor="pass2">Retype Password: </label>
			<input id="pass2" type="password" name="pass2" placeholder="password" />
			<input type="hidden" name="_csrf" value={this.props.csrf} />
			<input className="formSubmit" type="submit" value="Sign up" />
		</form> 
	);
};

const createLoginWindow = function(csrf) {
	
	const LoginWindow = React.createClass({
		handleSubmit: handleLogin,
		render: renderLogin
	});

	ReactDOM.render(
		<LoginWindow csrf={csrf} />,
		document.querySelector("#content")
	);
};

const createSignupWindow = function(csrf) {

	const SignupWindow = React.createClass({
		handleSubmit: handleSignup,
		render: renderSignup
	});

	ReactDOM.render(
		<SignupWindow csrf={csrf} />,
		document.querySelector("#content")
	);
};

const setup = function(csrf) {
	const loginButton = document.querySelector("#loginButton");
	const signupButton = document.querySelector("#signupButton");

	signupButton.addEventListener("click", (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});

	loginButton.addEventListener("click", (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});

	createLoginWindow(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});