var mongoose = require('mongoose');
var Story = mongoose.model('Story');//bring in model 'Story' schema
//assign to object Story 

//app.get('/stories',story.stories); routed to function handler
exports.stories=function(req,res){//
  Story.find({}, function(err,stories){//find/query { empyt }=everything from my DB collection 
  res.render('home',{stories:stories,session:req.session});//render home
  //also pass all my stories and session 
  });
}

exports.addStory=function(req,res){//req.res available via post ()
  //body of the post(), fetching field names to our variables
   var title=req.body.title;//coming from form
   var content=req.body.content;//coming from form
   var summary=req.body.summary;//coming from form
   var imageLink=req.body.imageLink;//coming from form
   var author =req.session.username;//coming from our session username
   console.log("Author is :"+author);

  //new Story() is going to give me new model instance 
   var newStory=new Story();//create new model instance
   //assigning value to it
   newStory.author=author;//assigning value
   newStory.title=title;
   newStory.content=content;
   newStory.summary=summary;
   newStory.imageLink=imageLink;

   //slide 22, 1:32:00, this is the logic where slug is generated doing three steps
   //slug to make it more redalbe URL, remove blackspace etc.. %20,%40 
   var lowercaseTitle=newStory.title.toLowerCase();//to lower case first
   var slug=lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");//using Regex-remove special characters
   var addingHyphen=slug.replace(/\s+/g, '-');//remove space with dash

   newStory.slug=addingHyphen; //assign new value to our model field slug in Story Schema 
   //once slug is generted we will do save below. 
   newStory.save(
     function(err,savedStory){//call back funciton have two parameter err, savedStory
      //if no error then return saveStory
       if(err){
         console.log("Error : While saving the story");
         return res.status(500).send();//if erro it will render 500.ejs
       }else{
         res.redirect("/stories");//will redirect to /stories route
       }
   });
}

//showing slug link which we click and render story page. 
exports.getStory=function(req,res){//view added story 
   var url=req.params.story;//it’s a path parameter obj which has obj name story assign to url
   Story.findOne({slug:url}, function(err,story){//fetch from database 
    //find one that match with db(slug):input-params/clickLink, register callback funciton give us story obj
           res.render('story',{story:story,session:req.session});//render story.ejs
           //render story (view name), story fethc from db and pass to story, with session to req.session 
           //+ story and session alogn with to render 
        });
}

//Video 2:10:12
exports.saveComment=function(req,res){//req will have both the params(link).slug,  
   var story_slug=req.params.slug;//req, on top of paramslink is slugcreated link
   var comment=req.body.comment;//will have post body user input comment simple text string
   var posted_date=new Date();//we assgine date when submit comment, not coming from schema as a default 

   Story.findOne({slug:story_slug}, function(err,story){//search and compair db.slug vs. parm.slug
      story.comments.push({body:comment,commented_by:req.session.username,date:posted_date});
      //within storry, field comments get push (data) uisng our define schema 
      //body has comment, commeted_by has username, and posted date generated at top
      //we are pushing it within commetn array then saveing it as below 
         story.save(function(err,savedStory){//if erro than show else render story. 
            if(err){
              console.log("Error : While saving comments");
              return res.status(500).send();
              }else{//after comment is stored, we are re-rendering same story
                //becase its all serverside templet, we can not update view without going back to server
                res.render('story',{story:story,session:req.session});
               }
              });
        });
 }
