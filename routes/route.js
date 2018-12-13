var mongoose = require( 'mongoose' );
var Story = mongoose.model( 'Story' );


exports.FuncIndex=function(req,res){
  res.render('RajIndex',{session:req.session});
//rendering Rajindex.ejs + send var sessoin:request.session to Rajindex.ejs
}//1.1.2 response.render(Rajindex.ejs + req.session) http://localhost:8080/

exports.FuncRegister=function(req,res){
  res.render('register');//view only no business login, render register.ejs
}//1.2.2 response.render(http://localhost:8080/register)


exports.FuncTechStack=function(req,res){
  res.render('techStack',{session:req.session});
}

exports.Home=function(req,res){
  Story.find({}, function(err,stories){
    res.render('home',{stories:stories});
  });
}

//1.3.1
exports.FuncLogin=function(req,res){//response  
  res.render('login');//render at login.ejs page
  }

//when user click on Share yoru own stoyr 
exports.FuncNewStory=function(req,res){
          if(req.session.loggedIn !== true){
            console.log("Logged In :"+req.session.loggedIn);
            res.redirect('/login');
          }else{
              res.render('new-story',{session:req.session});
          }
    }
