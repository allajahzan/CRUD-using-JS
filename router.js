const express = require('express');
const router = express.Router();

const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

const upload = multer({
  storage: storage,
});

// user controller
const userController = require('./controller/user')

//admin controller
const adminController = require('./controller/admin')

// validation middle wear
const validateUser = require('./validation/userMV')

// user routes---------------------------------------------------------------------------------------------------------

//load the application
router.get('/', userController.getuserpage);

//signinPage and signin
router.route('/signin/user')
.get(userController.getSigninPage)
.post(userController.signin)

// user signup
router.route('/signup/user')
.get(userController.getSignupPage)
.post(upload.any(),validateUser, userController.signup)

//get home
router.get('/home',userController.getHomePage);

//get user data and to update user data by user
router.route('/user')
.get(userController.getUserData)
.patch(upload.any(),validateUser,userController.updateUserData);

//logout user
router.get('/logout/user', userController.logout);

// admin routes---------------------------------------------------------------------------------------------------------

// to get admin signin page and post 
router.route('/signin/admin')
.get(adminController.getAdminSignin)
.post(adminController.adminSignin);

// to get admin page
router.get('/admin',adminController.getAdminPage);

// to get dashboard
router.get('/dashboard', adminController.getDashboard)

// get user, update user, delete user , add user by admin
router.route('/admin/user')
.get(adminController.getUser)
.post(upload.any(),validateUser,adminController.addUser)
.patch(upload.any(),validateUser,adminController.editUser)
.delete(adminController.deleteUser)

// search users 
router.get('/admin/search', adminController.searchUser)

// logout admin
router.get('/logout/admin', adminController.logout)

module.exports = router;