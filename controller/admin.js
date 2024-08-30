const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// get admin signin page
exports.getAdminSignin = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.render('adminlogin')
        }
        const token = req.session.admin
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')
        if (!isTokenValid) {
            return res.render('adminlogin')
        }
        const admin = await User.findById(isTokenValid.id)
        if (!admin) {
            delete req.session.admin
            return res.render('adminlogin')
        }
        res.redirect('/admin')
    }
    catch (err) {
        console.log(err.message);
    }
}

// to post signin admin 
exports.adminSignin = async (req, res) => {

    try {
        const { password, email } = req.body
        const user = await User.findOne({ email })

        if (!user || user.type !== 'admin') {
            return res.status(401).json({ msg: 'Invalid Email', type: 'email' })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ msg: 'Incorrect Password', type: 'password' })
        }

        const token = jwt.sign({ id: user.id }, 'admin-secret-token-key')
        req.session.admin = token;

        res.status(200).json({ msg: 'Successfully logged-In', type: 'success' })

    }
    catch (err) {
        console.log(err.message);
    }

}

// to get admin page
exports.getAdminPage = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/signin/admin');
        }
        const token = req.session.admin
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')
        if (!isTokenValid) {
            return res.redirect('/signin/admin')
        }

        const admin = await User.findById(isTokenValid.id);
        if (!admin) {
            delete req.session.admin
            return res.redirect('/signin/admin')
        }

        res.render('admin', { admin: admin });
    }
    catch (err) {
        console.log(err.message);
    }
}


// to get dashboard

exports.getDashboard = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/signin/admin')
        }

        const token = req.session.admin
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')
        if (!isTokenValid) {
            return res.redirect('/signin/admin')
        }

        const admin = await User.findById(isTokenValid.id);
        if (!admin) {
            return res.redirect('/signin/admin')
        }

        const user = await User.find({ type: 'user' });
        res.render('dashboard', { users: user })
    }
    catch (err) {
        console.log(err.message);
    }
}


// to edit user data by admin

exports.editUser = async (req, res) => {
    try {

        if (!req.session.admin) {
            return res.redirect('/signin/admin');
        }
        const token = req.session.admin;
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')

        if (!isTokenValid) {
            return res.redirect('/signin/admin')
        }

        const admin = await User.findById(isTokenValid.id)
        if (!admin) {
            return res.redirect('/signin/admin')
        }

        const { name, email, phoneNo, ogEmail } = req.body

        const user = await User.findOne({ email: ogEmail });

        if (!user) {
            return res.status(401).json({ msg: 'Invalid Email', type: 'error' })
        }

        user.name = name;
        user.email = email;
        user.phoneNo = phoneNo;
        if (req.body.file !== 'undefined') {
            user.profilePic = req.files[0].filename;
        }

        await user.save();

        res.status(200).json({ msg: 'Successfully updated', type: 'success' })

    }
    catch (err) {
        return res.status(401).json({ msg: 'Network Error', type: 'error' })

    }
}


// get user data by admin with user id

exports.getUser = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/signin/admin')
        }
        const token = req.session.admin;
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')
        if (!isTokenValid) {
            return res.redirect('/signin/admin')
        }

        const admin = await User.findById(isTokenValid.id);
        if (!admin) {
            return res.redirect('/signin/admin')
        }

        const id = req.query.id;
        const user = await User.findOne({ _id: id });
        res.json({ user });
    } catch (err) {
        console.log(err.message);
    }
}


// to delete user by Id by admin 

exports.deleteUser = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/signin/admin')
        }
        const token = req.session.admin;
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')

        if (!isTokenValid) {
            return res.redirect('/signin/admin')
        }

        const admin = await User.findById(isTokenValid.id)
        if (!admin) {
            return res.redirect('/signin/admin')
        }

        const userId = req.query.id;

        const user = await User.findById({ _id: userId })
        if (!user) {
            return res.status(401).json({ msg: 'Invalid User', type: 'error' })
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ msg: 'Successfully deleted', type: 'success' })


    }
    catch (err) {
        console.log(err.message);
    }
}


// to add user by admin

exports.addUser = async (req, res) => {
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
            return res.status(400).json({ msg: 'Email already exists', type: 'error' })
        }

        const user = new User({ name, email, password: hashedPassword, phoneNo, profilePic })
        await user.save();
        res.status(200).json({ msg: 'User added successfully', type: 'success' });
    }
    catch (err) {
        console.log(err.message);
    }
}

//to logout admin

exports.logout = async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/signin/admin')
    }
    const token = req.session.admin;
    const isTokenValid = jwt.verify(token, 'admin-secret-token-key')
    if (!isTokenValid) {
        return res.redirect('/signin/admin')
    }
    const admin = await User.findById(isTokenValid.id)
    if (!admin) {
        delete req.session.admin
        return res.redirect('/signin/admin')
    }
    delete req.session.admin
    res.redirect('/signin/admin')
}

// search users by name or email id or phone number

exports.searchUser = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/signin/admin')
        }
        const token = req.session.admin;
        const isTokenValid = jwt.verify(token, 'admin-secret-token-key')
        if (!isTokenValid) {
            return res.redirect('/signin/admin')
        }
        const admin = await User.findById(isTokenValid.id)
        if (!admin) {
            delete req.session.admin
            return res.redirect('/signin/admin')
        }

        let data = req.query.user;

        let query = {type:{$eq:'user'}}
        if(data)
        {
            query = {
                $and: [
                    { $or: [{ name: { $regex: data, $options:'i' } }, { phoneNo: { $regex: data } }] },
                    { type: { $ne: 'admin' } }
                ]
            };
        }

        const users = await User.find(query);
        res.render('dashboard', { users: users , search:data}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
