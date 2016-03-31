// Global Variables
var postId, username;

function setUpComponents() {
	// Button for creating a new comment
	$('#createComment').on('click', createCommentHandler);
	// Call function to display the selected post
	getPost();
	// Gather information about the blog and display it on the page
	getBlogDetails();
}

function getBlogDetails() {
	// Get the blog to display the bio and title of the users blog
	$.getJSON('http://143.44.10.35/Blog/api/blog?user='+parseInt(sessionStorage.getItem('id'))).done(getBlogDetailsCallBack);
}

function getBlogDetailsCallBack(data) {
// Change the title of the page to the title of the users blog and replace the nav bar title with the users blog title
	$('#blogTitle').text(data.title);
	$('#navTitle').text(data.title).attr('href', "Home.html#" + parseInt(sessionStorage.getItem('id')) + "").on('click', function() {window.location.reload(true); });
	// Display the bio of the blog
	$('#about').text(data.bio);	
}

function createCommentHandler() {
	// Makes a POST for the server to create a new comment
	if($('#comment').val().length == 0){
		$('#comment').val('To make a comment, you need to put in a little more effort than that!')
	} else {
		var post = {post:postId,comment:$('#comment').val(), user:parseInt(sessionStorage.getItem('id'))};
			$.ajax({
			  url:'http://143.44.10.35/Blog/api/comment',
			  type:'POST',
			  data:JSON.stringify(post),
			  contentType:'application/json',
			  dataType:'json',
			  success: refresh
			});
		}
}

function getPost() {
	// First we retrieve the id of the post that is embedded in the URL
	postId = (window.location.href.split('#'))[1];
	// We need to get the post with the associated id
	$.getJSON('http://143.44.10.35/Blog/api/post/'+postId).done(getPostCallBack);
}

function getPostCallBack(data) {
	var newDiv, postDiv;
	var newH, newP,newHr; 
	
	// Find the main div that will house the post
	postDiv = $('#postDiv');
	
	// The title of post
	newH = $('<h3>').html('<a href=#' + postId +' > '+ data.topic + '<a>');
	// A new p element that will dislpay the content of the post
	newP = $('<p>').text(data.content);
	// A styling bar
	//newHr = $('<hr>');
	// The division that houses the posts
	newDiv = $('<div>').attr('id', postId);
			
	// Attach all the elements we created to the post's division
	newDiv.append(newH);
	newDiv.append(newP);
			
	// Attach the newly constructed division to the main div for all the posts, along with the hr element at the bottom
	postDiv.prepend(newDiv)
	//postDiv.prepend(newHr);
	
	// Obtain the comments for the post
	getComments();
}

function getComments() {
	$.getJSON('http://143.44.10.35/Blog/api/comment?post='+postId).done(getCommentsCallBack);
}

function getCommentsCallBack(data) {
	var commentCount, n, i = 0, userId;
	var newDiv, commentDiv, newP1, newP2, newA;
	
	
	// Find out how many comments are on this post
	commentCount = data.length;
	
	// Main div for comments
	commentDiv = $('#commentDiv');
	
	// Construct a new division for each of the comments 
	for(n = commentCount; n > 0; n--) {
		// We get the username of the person who made the comment 
		userId = data[i].user;
		getUsername(userId);
		
		// Set number of comments
		$('#commentCount').text(commentCount + ' comment(s)');
		
		// Create a div for the comments to be placed in
		newDiv = $('<div>').attr('class', 'panel panel-default panel-body');
		
		// Append the p elemts onto the newDiv
		newDiv.append($('<p>').text('Anonymous ' + userId + ' says:'));
		newDiv.append($('<p>').text(data[i].comment));
		
		// Append the comment div onto the main div that holds all the comments
		commentDiv.append(newDiv);

		i++;
	}
}

function getUsername(userId) {
	$.getJSON('http://143.44.10.35/Blog/api/user/'+userId).done(function(data){username = data.name;});
}

function refresh() {
	window.location.href = window.location.href; window.location.reload(true); 
}

$(window).load(setUpComponents);