// Global Variables
var group_number = 11;
var blog_Id;

function setUpComponents() {
	// Button for creating a new post
	$('#createPost').on('click', createPostHandler);
	// Call function to display the blog of current user 
	getBlog();
	// Retrieve blog info fom other users
	getNewestBlogs();
}

$.wait = function(ms) {
    var defer = $.Deferred();
    setTimeout(function() { defer.resolve(); }, ms);
    return defer;
};

function getNewestBlogs() {
	$.getJSON('http://143.44.10.35/Blog/api/blog/all?group='+11).done(getNewestBlogsCallBack);
}

function getNewestBlogsCallBack(data) {
	var newH, newA, newHr, newestBlogs;
	var n, url;
	
	// Find the newestBlogs div that will house newly created blogs
	newestBlogs = $('#newestBlogs');
	
	for(n = data.length-1; n > data.length-data.length + 5; n--){
		url = "Home.html#" + data[n].user + "";
		newA = $('<a>').attr('href', url).text(data[n].title).on('click', function() {window.location.href = url; window.location.reload(true); });
		
		newH = $('<h6>').append(newA);
		newHr = $('<hr>');
		
		newestBlogs.append(newH);
		newestBlogs.append(newHr);
	}
}

function getBlog() {
	// Get the blog to display the bio and title of the users blog
	// We have the users Id embedded in the html page
	userId = (window.location.href.split('#'))[1];
	$.getJSON('http://143.44.10.35/Blog/api/blog?user='+userId).done(getBlogCallBack);
	
	// Check to see if the user viewing the page is the owner or not so that we can 
	//determine if the user is allowed to create new posts
	if(userId != parseInt(sessionStorage.getItem('id'))){
		$('#newPost').hide();
	}
}

function getBlogCallBack(data) {
	// Set our global variable to the blog id to get posts made by the user if they exist
	blog_Id = data.idblog;
	// Change the title of the page to the title of the users blog and replace the nav bar title with the users blog title
	$('#blogTitle').text(data.title);
	if(userId != parseInt(sessionStorage.getItem('id'))){
		$.getJSON('http://143.44.10.35/Blog/api/blog?user='+parseInt(sessionStorage.getItem('id'))).done(function (data) { $('#navTitle').text(data.title).attr('href', "Home.html#" + data.user + "");}); } else {
	$('#navTitle').text(data.title).attr('href', "Home.html#" + parseInt(sessionStorage.getItem('id')) + ""); } 
	// Display the bio of the blog
	$('#about').text(data.bio);
	// Save the blog_Id for future use
	sessionStorage.setItem('blogId', blog_Id);
	// Get all the posts the user has made and display them on the page
	displayPosts();
}


function displayPosts() {
	// Run a request to get all the posts for the blog
	$.getJSON('http://143.44.10.35/Blog/api/post?blog='+blog_Id).done(displayPostsCallBack);
}

// Go through all the posts the user has made and dispaly them on the page
function displayPostsCallBack(data) {
	var n, i = data.length-1, newDiv, postDiv;
	var newH, newP, newA, newHr;
	var postId;
	
	// Find the main div that will house all the posts
	postDiv = $('#postDiv');
	
	if(data.length == 0) {
		// Maybe highlight the button to encourage the user to make their own post
	} else {
		// We will make a new div for each post that exists
		// By the very nature of arrays the newest post will actually be in the last slot so we will go through the array in reverse order
		for(n = data.length; n > 0; n--){
			// Save the id of the post to attach it to the html page each post sends you to
			postId = data[i].idpost;
			// Create a new header that will display the users Topic, that title will also be a link that leads to a Post page where
			// users that see the full post along with all the comments
			var url = "Post.html#" + postId + "";
			newH = $('<h3>').html('<a href='+url+'>' + data[i].topic + '<a>');
			// A new p element that will dislpay the content of the post
			newP = $('<p>').text(data[i].content);
			// A link that will send them to the post page to view the comments
			newA = $('<a>').attr('href', url).text('Comments');
			// A styling bar
			newHr = $('<hr>');
			// The division that houses the posts
			newDiv = $('<div>').attr('id', postId);
			
			// Attach all the elements we created to the post's division
			newDiv.append(newH);
			newDiv.append(newP);
			newDiv.append(newA);
			
			// Attach the newly constructed division to the main div for all the posts, along with the hr element at the bottom
			postDiv.append(newDiv)
			postDiv.append(newHr);
			i--;
		}
	}
}

function createPostHandler() {
	$('#createPost').prop('disabled', true);
	// Makes a POST for the server to create a new post
	var post = {topic:$('#topicTitle').val(),content:$('#content').val(), blog:blog_Id};
		$.ajax({
		  url:'http://143.44.10.35/Blog/api/post',
		  type:'POST',
		  data:JSON.stringify(post),
		  contentType:'application/json',
		  dataType:'json',
		  success: refresh
		});
}

function refresh() {
	window.location.href = window.location.href; window.location.reload(true); 
}

$(window).load(setUpComponents);