const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// get '/' router

exports.getuserpage = async (req, res) => {
   try{
    if (!req.session.user) {
        return res.redirect('/signin/user')
    }
    const token = req.session.user
    const isTokenValid = jwt.verify(token, 'token-user-key-secret')
    if (!isTokenValid) {
        return res.redirect('/signin/user')
    }
    const user = await User.findById(isTokenValid.id);
    if (!user) {
        delete req.session.user;
        return res.redirect('/signin/user')
    }
    res.redirect('/home');
   }
   catch(err)
   {
    console.log(err.message);
   }
}

// get login page

exports.getSigninPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.render('login');
        }
        const token = req.session.user;
        const isTokenValid = jwt.verify(token, 'token-user-key-secret');
        if (!isTokenValid) {
            return res.render('login');
        }
        const user = await User.findById(isTokenValid.id)

        if (!user) {
            delete req.session.user;
            return res.render('login');
        }

        res.redirect('/home')
    }
    catch (err) {
        console.log(err.message);
    }
}

// get signup page

exports.getSignupPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.render('signup');
        }
        const token = req.session.user;
        const isTokenValid = jwt.verify(token, 'token-user-key-secret');
        if (!isTokenValid) {
            return res.render('signup');
        }
        const user = await User.findById(isTokenValid.id)

        if (!user) {
            delete req.session.user;
            return res.render('signup');
        }

        res.redirect('/home')
    }
    catch (err) {
        console.log(err.message);
    }
}

// for user signup

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phoneNo } = req.body;

       
        let profilePic
        if(req.files[0] !== undefined)
       {
        profilePic = req.files[0].filename
       }else{
        profilePic = null
       }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ msg: 'Email already exists', msgType: 'email' })
        }

        const user = new User({ name, email, password: hashedPassword, phoneNo, profilePic })
        await user.save();
        res.status(200).json({ msg: 'Successfully registered', msgType: 'success' })

    }
    catch (err) {
        return res.status(500).json({ msg: 'Network Error', type: 'error' })
    }
}

// for user signin

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.type === 'admin') {
            return res.status(401).json({ msg: 'Invalid Email', type: 'email' })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ msg: 'Incorrect Password', type: 'password' })
        }

        const secretKey = 'token-user-key-secret'
        const token = jwt.sign({ id: user._id }, secretKey);

        req.session.user = token;

        res.status(200).json({ ...user._doc, token })
    }
    catch (err) {
        return res.status(500).json({ msg: 'Network Error', type: 'error' })
    }
}

// get home page

exports.getHomePage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/signin/user')
        }
        const token = req.session.user;
        const isTokenValid = jwt.verify(token, 'token-user-key-secret');
        if (!isTokenValid) {
            return res.redirect('/signin/user')
        }
        const user = await User.findById(isTokenValid.id)
        if (!user) {
            delete req.session.user;
            return res.redirect('/signin/user');
        }
        res.render('home', { user: user })
    }
    catch (err) {
        console.log(err.message);
    }
}

// get user data

exports.getUserData = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/signin/user')
        }
        const id = req.query.id;
        const user = await User.findById(id);
        res.json({ user })
    }
    catch (err) {
        console.log(err);
    }
}

// to update user data by user in home

exports.updateUserData = async (req, res) => {

    try {
        if (!req.session.user) {
            return res.redirect('/signin/user')
        }

        const { name, email, phoneNo, password, ogEmail } = req.body;

        const user = await User.findOne({ email: ogEmail })
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Email', type: 'error' })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({ msg: 'Incorrect Password', type: 'error' })
        }

        user.email = email;
        user.name = name;
        user.phoneNo = phoneNo;

        if (req.body.file !== 'undefined') {
            user.profilePic = req.files[0].filename
        }

        await user.save();

        res.status(200).json({ msg: 'Successfully updated', type: 'success' })
    }
    catch (err) {
        return res.status(401).json({ msg: 'Netwrok Error', type: 'error' })
    }
}

// to logout user

exports.logout = async (req,res)=>{
    if(!req.session.user)
    {
        return res.redirect('/signin/user')
    }
    const token = req.session.user
    const isTokenValid = jwt.verify(token, 'token-user-key-secret')
    if(!isTokenValid)
    {
        return res.redirect('/signin/user')
    }
    const user = await User.findById(isTokenValid.id)
    if(!user)
    {
        delete req.session.user
        return res.redirect('/signin/user')
    }
    delete req.session.user
    res.redirect('/sigin/user')
}

