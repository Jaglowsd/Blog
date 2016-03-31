// Global variables
var checkUser;
var groupData;

// Set up the buttons on the login page
function setUpButtons() {
	// Button for submitting login info
	$('button#login').on('click', LoginHandler);
	// Button for creating an account
	$('button#register').on('click', CreateAccountHandler);
	// Make a button to display the form for logging in
	$('button#showLogin').on('click', displayLogin);
	// Make a button to display the form for creating a new account
	$('button#showRegister').on('click', displayRegister);
	
	// Hide both of the divisions upon loading
	$('#loginDiv').hide();
	$('#regDiv').hide();
	
	$('#test').hide();
	
	// We gather all users in our group upon loading so that we can later check if a new users username conflicts with an already existing one
	// The reason we do this now is because if we run the GET request right before making the new user, we will not have found out in time 
	// if that username already exists because of presumed lag time of the server, so the test to see if our checkUsername returns -1 will fail every time
	// Also, this is necessary because if the server finds more than one user object with the same username when logging in, an error will be thrown depsite having created the user
	// because the server excepts to return only a single result
	getGroupInfo();
}

// Connect the event handler to the document
$(window).load(setUpButtons);

// Event handler for the login button
// Only returns the id associated with the user if they exist, or 0 if they do not
function LoginHandler() {
	$.getJSON('http://143.44.10.35/Blog/api/user/login?name='+$('#loginUser').val()+'&password='+$('#loginPass').val()).done(loginCallBack);
}

function loginCallBack(Id) {
	if(Id != 0){
		// Storing the id number of the user
		sessionStorage.setItem('id',Id);
		// Store the username for future use
		sessionStorage.setItem('username', $('#loginUser').val());
		// If the account exists, open a new page
		window.location.href = 'Home.html#' + Id;
	}
	else {
		// If the account doesn't exist, show a text field saying that the account entered does not exist
		$('#loginUser').val('Your desired username is unfortunately already in use...');
		$('#test').show();
	}
}

function CreateAccountHandler() {
	// Check to see if the passwords that the user inputted match
	if($('#regPass').val() != $('#regPassConf').val()){
		$('#regUser').val('Error: passwords do not match');
		$('#regPass').val('');
		$('#regPassConf').val('');
	} 
	// Else if's for various errors the users might make
	
	else{
		checkUsername();
		if(checkUser == -1){
			$('#regUser').attr('placeholder', 'Your desired username is unfortunately already in use...');
			$('#regPass').val('');
			$('#regPassConf').val('');
			checkUser = 0;
		} else{
			// Run a POST request to the server to create a new account
			// Then we can run a GET requets to the server to obtain the user ID number by logging them in upon creation
			var post = {name:$('#regUser').val(),password:$('#regPass').val(), privileges: 'simple', group: '11'};
			$.ajax({
			  url:'http://143.44.10.35/Blog/api/user',
			  type:'POST',
			  data:JSON.stringify(post),
			  contentType:'application/json',
			  dataType:'json',
			  success: getUserId
			});
		}
	}
}

// Comparing all the subscribed usernames with the user who is attempting to create a new account
function checkUsername() {
	var n;
	for(n=0; n < groupData.length; n++){
		if($('#regUser').val() == groupData[n].name){
			checkUser = -1;
			return;
		}
	}
}

function getUserId() {
	$.getJSON('http://143.44.10.35/Blog/api/user/login?name='+$('#regUser').val()+'&password='+$('#regPass').val()).done(createBlog);
}

function createBlog(Id) {
	// Storing the id number of the user
	sessionStorage.setItem('id',Id);
	// If the account exists, open a new page
	window.location.replace('CreateBlog.html');
}

function displayLogin() {
	// Change a setting of a form to show/hide the login 
	$('#loginDiv').toggle();
}

function displayRegister() {
	// Change a setting of a form to show the register
	$('#regDiv').toggle();
}

function getGroupInfo() {
	$.getJSON('http://143.44.10.35/Blog/api/user?group='+11).done(getGroupInfoCallBack);
}

// We need to check to see if the user name the user entered is already in use because the server will only return one user collection
// if the server finds more than one user with the same name, an error is thrown
function getGroupInfoCallBack(data) {
	groupData = data;
}