var chalk = require('chalk');//pkg for color coding msg output, not using it now
var express=require('express');//express js needed pkg 
var mongoose=require('mongoose');//needed for database operation
var db=require('./models/db.js');//registoring all the stuff 

var VarRoutes=require('./routes/route.js');//need route.js file and use function 
var Varuser=require('./routes/user.js');//need user.js operation on user.js
var story=require('./routes/story.js');//need story.js
var bodyParser=require('body-parser');//body parser store  it as middlware 

var session=require('express-session');//store it as session objtect 
//var cookieParser=require('cookie-parser');

var app=express();//creating express application 
app.set('view engine','ejs');//setting the view engie to EJS
app.use(express.static(__dirname + '/public'));//static folder for css,img,jquery

//when we have generic middlware rather than using get,post method we use function known as
//.use( ), app.use() will register generic middlware such as .statically served pages
//similarlly for bodyparser we are saying parse json body alone thats how we will send, 
//if post body is type JSON than it will be handle by middlware, 
//also it will handle urlencoded data, it can parse urlencoded data along with JSON.
app.use(bodyParser.json());//bodyparser to use as middlware 
app.use(bodyParser.urlencoded({extended:false}));
//app.use(cookieParser());

//Slide 25, 2:25:10,2:30:00  configuring express session uisng express-session package
var session=require('express-session');//
app.use(session({secret:"qazwsxedcrfvtgbyhnujm",resave: true, saveUninitialized: true}));
//use the session obj as middleware .use( ),where it uses secret to encrypt the data in the session storage
//which is stored in memory in serverside, we dont have access to in memory storage, its handled automatically 
//express and express-session, but only thing if you specify the secreate it will be stored in proper manor
//in a secure way. resave is to save any new modification even if the sessin was never modified

//Below are function handler in routes.js define file name associated to function
//define above, var routes = require('./routes/route.js') . function var =index
//(variable.function)=(routes.index) variable (file route.js).index(function pulling Rajindex.ejs) 
app.get('/',VarRoutes.FuncIndex);// 1.1.1 asking to get routes.index function and parse it 
app.get('/register',VarRoutes.FuncRegister);//1.2.1 goto VarRoutes=[require('./routes/route.js')].FuncRegister(function-handler) & fetch path
app.get('/login',VarRoutes.FuncLogin);//1.3.1 URL:8080/login
app.get('/registrationSuccessful',Varuser.registrationSuccessful);//URL:8080/registrationSuccessful
app.post('/newUser',Varuser.doCreate);//1.2.3 go to doCreate and fetch a path as per function
app.post('/authenticate',Varuser.login);//1.3.1 its an API not a View 

//below are API's for story and Routes/Links
app.get('/new-story',VarRoutes.FuncNewStory);//VIEW API //Creating Story
app.post('/add-story',story.addStory);//API-DB Operation //Adding to DB
app.get('/stories',story.stories);//list the story View only + API/DB Call to Render View
//1.2 localhost:8080/stories get('/UrlPath,Variable.function)
app.get('/stories/:story',story.getStory);//Get/Pick a Full Story given Slug & render it 
app.post('/stories/:slug/saveComment',story.saveComment);//find story and add comment on top of it

app.get('/techStack',VarRoutes.FuncTechStack);//URL:8080/techStack
app.get('/logout',Varuser.logout);//URL:8080/logout

//Student ask how to delete the story, you can use below 
//app.delete('/stories/:slug/',VarRoutes.deleteStory);

//added two more middleware to handler error 404 and 500 
app.use(function(req, res) {//generic route mistyped error handler 
     console.log(chalk.red("Error: 404"));
     res.status(404).render('404');
});

app.use(function(error, req, res, next) {
     console.log(chalk.red('Error : 500'+error))
     res.status(500).render('500');
});

var port = process.env.PORT || 8080;
var server=app.listen(port,function(req,res){
    console.log(chalk.green("Catch the action at http://localhost:"+port));
});
