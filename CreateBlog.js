// Global variable for the group number
var group_Number = 11;

function setUpButtons() {
	// Button to display the form for making a title and bio
	$('button#showForm').on('click', displayRegister);
	// Button to submit the info for their blog
	$('button#createBlog').on('click', blogHandler);

	// Toggling the button to show the form 
	$('#form').hide();
}

// Connect the event handler to the document
$(document).ready(setUpButtons);

function blogHandler() {
	// Makes a POST for the server to create a new blog
	var post = {title:$('#title').val(),bio:$('#bio').val(), user:parseInt(sessionStorage.getItem('id')), group: group_Number};
		$.ajax({
		  url:'http://143.44.10.35/Blog/api/blog',
		  type:'POST',
		  data:JSON.stringify(post),
		  contentType:'application/json',
		  dataType:'json',
		  success: newPage
		});
}

function newPage() {
	// Store the users Id number before sending them to the new page
	sessionStorage.setItem('id', parseInt(sessionStorage.getItem('id')));
	// Will send the user to the main page 
	window.location.href = 'Home.html#' + parseInt(sessionStorage.getItem('id'));
}

function displayRegister() {
	// Display the form for entering the title and bio of the users blog
	$('#form').show();
	$('#showForm').hide();
}