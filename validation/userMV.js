const validateUser = async (req, res, next) => {

    const namePattern = /^[A-Za-z]+( [A-Za-z]+)*$/;
    const emailPattern = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    const phoneNoPattern = /^[1-9][0-9]{9}$/;
    const passwordPattern = /^(?!.*\s).{8,16}$/;

    const { name, email, password, phoneNo } = req.body;

    // Name Validation
    if (!namePattern.test(name.trim())) {
        return res.status(400).json({ msg: 'Invalid Name', type: 'error' , msgType:'name'});
    }

    // Email validation
    if (!emailPattern.test(email.trim())) {
        return res.status(400).json({ msg: 'Invalid Email Format', type: 'error', msgType:'email' });
    }

    // Password Validation if password is not undefined
    if (password !== undefined && !passwordPattern.test(password.trim())) {
        return res.status(400).json({ msg: 'Invalid Password', type: 'error' , msgType:'password'});
    }

    // PhoneNo validation
    if (!phoneNoPattern.test(phoneNo.trim())) {
        return res.status(400).json({ msg: 'Invalid Phone Number', type: 'error' , msgType:'phoneNo'});
    }

    if(email === password)
    {
        return res.status(400).json({ msg: 'Password shouldn\'t be same as email ', type: 'error' , msgType:'password'});
    }

    next();
}

module.exports = validateUser;
