var express =require("express"),
app         =express(),
bodyParser  =require("body-parser"),
mongoose    =require("mongoose"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine","ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.use(expressSanitizer());

var blogSchema= new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1504786328163-b16f428adc28?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fa4183c2f5bcc5331c32e93c0f1109bb&auto=format&fit=crop&w=1047&q=80",
//     body:"Hello this is a blog post"
// },function(err,blog){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(blog);
//     }
// });

//Index page
app.get("/",function(req,res){
   res.redirect("/blogs"); 
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs}); 
        }
    });
});

//New page
app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});

//Craete page
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
       if(err){
           console.log(err);
       } 
       else{
           res.redirect("/blogs");
       }
    });
});

//Show page
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.render("show",{foundBlog:foundBlog});
       }
    });
});

//Edit page
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           console.log(err);
       } 
       else{
           res.render("edit",{foundBlog:foundBlog}); 
       }
    });
});

//Update page
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete page
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});

