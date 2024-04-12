var express = require('express');
const axios = require('axios'); 
const passport = require('passport');
const localStrategy=require("passport-local")
var userModel = require('./users');
var postModel = require('./post');
passport.use(new localStrategy(userModel.authenticate()))
const upload=require("./multer")


var router = express.Router();
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user =
  await userModel 
      .findOne({username:req.session.passport.user})
      .populate('posts')
      // console.log(user);
  res.render('profile',{user,nav:true});
});

router.get('/show/posts',isLoggedIn, async function(req, res, next) {
  const user =
  await userModel
      .findOne({username:req.session.passport.user})
      .populate('posts')
      // console.log(user);
  res.render('show',{user,nav:true});
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user =await userModel.findOne({username:req.session.passport.user})
 const posts= await postModel.find()
  .populate("user")
  res.render('feed',{user,posts,nav:true});
});

router.get('/add',isLoggedIn, async function(req, res, next) {
  const user =await userModel.findOne({username:req.session.passport.user})
  res.render('add',{user,nav:true});
});



// router.post('/createpost', isLoggedIn, upload.single('postimage'), async function(req, res, next) {
//   // Convert the uploaded file to Base64
//   const base64Image = req.file.buffer.toString('base64');

//   // Set up the API request payload
//   const apiPayload = {
//     "Parameters": [
//       {
//         "Name": "File",
//         "FileValue": {
//           "Name": "my_file.ai",
//           "Data": base64Image
//         }
//       },
//       {
//         "Name": "StoreFile",
//         "Value": true
//       }
//     ]
//   };

//   // Set up the API request headers
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   // Replace '0TsqAfPEvqQXnxNk' with your actual Secret key
//   const apiUrl = 'https://v2.convertapi.com/convert/ai/to/webp?Secret=0TsqAfPEvqQXnxNk';

//   try {
//     // Send the POST request to ConvertAPI
//     const response = await axios.post(apiUrl, apiPayload, config);

//     // Assuming the API response contains the URL to the converted image
//     const convertedImageUrl = response.data.Files[0].Url;
//     sharp(convertedImageUrl)
//     .resize({ width: 800 }) // Optional: Resize if you want to change dimensions
//     .webp({ quality: 80 }) // Adjust quality to reduce file size
//     .toBuffer()
//     .then(processedImageBuffer => {
//       console.log(processedImageBuffer);
//         // Use `processedImageBuffer` for your next steps, e.g., saving to your database
//     })
//     .catch(error => {
//         console.error("Error processing image:", error);
//     });
//     // Now you can use `convertedImageUrl` for your next steps, for example, saving it to your database
//     const user = await userModel.findOne({username: req.session.passport.user});
//     const post = await postModel.create({
//       user: user._id,
//       title: req.body.title,
//       description: req.body.description,
//       image: convertedImageUrl // Use the URL of the converted image
//     });
//     user.posts.push(post._id);
//     await user.save();
//     res.redirect("/profile");
//   } catch (error) {
//     console.error("Error converting file:", error);
//     res.status(500).send("Error processing your request");
//   }
// });

router.post('/createpost',isLoggedIn,upload.single('postimage'), async function(req, res, next) {
 
  const dataURL = `data:image/webp;base64,${resizedImageBuffer.toString('base64')}`;
  const user =await userModel.findOne({username:req.session.passport.user})
  const post =await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    image:dataURL
  });
  user.posts.push(post._id)
  await user.save();
  res.redirect("/profile")
});

router.post('/fileupload',isLoggedIn, upload.single('image'), async function(req, res, next) {
  
const dataURL = `data:image/webp;base64,${resizedImageBuffer.toString('base64')}`;
 const user =await userModel.findOne({username:req.session.passport.user})
 user.profileImage=dataURL;
 await user.save();
 res.redirect("/profile");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
    }
    res.redirect("/");
}

router.post('/register',function(req,res){
  var userdata = new userModel({
    username:req.body.username,
    email : req.body.email,
    contact:req.body.contact
  })
  // console.log(req.body);
  userModel.register(userdata ,req.body.password)
.then(function(registereduser){
  passport.authenticate("local")(req,res,function(){
    res.redirect('/profile')
  })
})
})



router.post("/login" ,passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})

router.get('/logout',function(req,res,next){
req.logout(function(err){
  if(err){return next(err);}
  res.redirect('/')
})
})

module.exports = router;
