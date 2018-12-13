var mongoose = require( 'mongoose' );//import mongoose database coon. 
var User = mongoose.model( 'RajUserModel' );//import model object (db.js) & assigne to var User

exports.registrationSuccessful=function(req,res){
  res.render('new-user');
                  }
//1.4.1
exports.logout=function(req,res){
    console.log("Logging  Out :"+req.session.username);
    var loggedOutUser=req.session.username;
    //taking backup of user name before destroying

    req.session.destroy();
    console.log("Logged Out :"+loggedOutUser);
    res.render('logout',{loggedOutUser:loggedOutUser});
    //render logout page with user name stored in loggedOutUser 
}

//1.2.4 function handler is .doCreate, how creation of user happens
exports.doCreate=function(req,res){//req,res general req/res to browser
   var username=req.body.Formusername;//extract form input & assigne to variable
   var email=req.body.Formemail;//extract and assigne value to var email
   var password=req.body.Formpassword;//comes from body(express body parser) of the post reqeust 

   //createing constrctor using new User() which has RajUserModel(db.js)
   var newuser=new User();//gving us a model instance newuser (its a unsave in-memory-document variable)
   //newuser using bluprint of a User model, saving newuser input fiels as a variable
   newuser.username=username; //model_Instance.username = .doCreate var username
   newuser.email=email;//obj-instacne(email)=var email=req.body.Formemail
   newuser.password=password;//remember password is plan text, below save operation will get 
   //conveted into cyphertext because having virtue of allready registered hook, when we do save
   //first operation is 

   newuser.save(function(err,savedUser){//when we do save, 1st operation go to hook, encrypt, 
    //and finaly brings me saveUser(instance) return back or outside from database if any,    
       if(err){//if any error send below err msg 
         console.log("User already exists with that username or email");
         var message="A user already exists with that username or email";
         res.render("register",{errorMessage:message}); //re-render register page with erro msg on top 
         return;
       }else{//if no error than render new-user page along with session information
         req.session.newuser=savedUser.username;//we create session info, rather context info
         //req.session allready exist on top of that newuser obj = saved username from DB 
         res.render("new-user",{session:req.session});//render new-user page along with session info
       }
   });
}

//1.3.1
exports.login=function(req,res){//accecpts req,res objects 
    var bodyemail=req.body.Loginemail;//extact input fields from body
    var password=req.body.Loginpassword;//and assigne to varible 
//we aer going to compari hash password stored in database to incoming input password
//which we will again hash to compair in our database.  

//User(RajUserModel).FindOne(compair DB email to Input bodyemail, function(){ })
    User.findOne({email:bodyemail},//firt param output, compair and match with DB 
      function(err,Varuser){//callback function (get an err, or get record from DB )
      console.log("User "+Varuser);
      if(Varuser==null){//which is nothing but result of compair if any match & if no match
        console.log("User is null redirecting to login");
        var message="Invalid email or password";
        console.log("Message :"+message);
        res.render("login",{errorMessage:message});//re-render the loing page wiht err msg
        return;
      }
    //if email is a match uisng findOne({email:bodyemail}) output then follow
    //model instance Varuser(email).comparePassword(inputPassword),function(err,iMatch) 
     Varuser.comparePassword(password, //passing argument as user input password using req.body
      //comparePassword is registered in schema db.js and its a helper method, 
      //we will invoke on top of model instance (Varuser) 
      function(err,isMatch){//callback function waiting to declar result err or match true/false
       if(isMatch && isMatch==true){ //password is typed && also valid/true using comparePassword()
         console.log("Authentication Successfull");
         //this is where we create our session object and store var username & loggedIn 
         req.session.username=Varuser.username;//we will create session obj & store username
        //also we are settign variable loggedIn to true and attached session on top 
         req.session.loggedIn=true;//making loggedIn session to be true 
         console.log("Got User : "+req.session.username);
         res.render("new-story",{session:req.session});//render page with session details
         //res.render("home",{session:req.session});//render page with session details         
       }else{//if its false than show erro msg and render loing page again 
         console.log("Authentication UnSucessfull");
         var message="Invalid email or password";
         console.log("Message :"+message);
         res.render("login",{errorMessage:message});
         return;
       }
     });
    });
  }
