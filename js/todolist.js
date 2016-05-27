$(function () {
    var APPLICATION_ID = "2EE6F123-C9A5-5721-FF54-D52DD7920800",
        SECRET_KEY = "0A072750-AC71-FBFC-FFCA-6CBC97315E00",
        VERSION = "v1";
    
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
    
    var postsCollection = Backendless.Persistence.of(Posts).find();
    
    console.log(postsCollection);
    
    var wrapper = {
        posts: postsCollection.data
    };
    
    Handlebars.registerHelper('format', function (time) {
        return moment(time).format("dddd, MMMM Do YYYY");
    });
    
    if(Backendless.UserService.isValidLogin()){
        userLoggedIn(Backendless.LocalCache.get("current-user-id"));
        var blogScript = $("#blogs-template").html();
        var blogTemplate = Handlebars.compile(blogScript);
        var blogHTML = blogTemplate(wrapper);
        $('.main-container').html(blogHTML); 
    }   else {
        Materialize.toast('Login to view posts!', 4000);
    }

    
});

function Posts(args) {
    args = args || {};
    this.title = args.title || "";
    this.content = args.content || "";
    this.content2 = args.content2 || "";
    this.content3 = args.content3 || "";
    this.authorEmail = args.authorEmail || "";
}

function userLoggedIn(user) {
    var userData;
    if (typeof user == "string") {
        userData = Backendless.Data.of(Backendless.User).findById(user);
    }   else {
        userData = user;
    }
    console.log("User successfully logged in");
}