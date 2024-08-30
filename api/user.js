// for signup user-----------
function onloadUserSignUp() {
    // for user signup to connect to api
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = signupForm[0].value
        const email = signupForm[1].value
        const phoneNo = signupForm[2].value
        const password = signupForm[3].value
        const upic = signupForm[4].files[0];

        const name_ = document.getElementById('uname-signup')
        const email_ = document.getElementById('uemail-signup')
        const phoneNo_ = document.getElementById('uphoneNo-signup')
        const password_ = document.getElementById('signup-password')

        const name_error = document.getElementById('signup-error-name')
        const email_error = document.getElementById('signup-error-email');
        const password_error = document.getElementById('signup-error-password')
        const phoneNo_error = document.getElementById('signup-error-phoneNo');
        const visibility = document.getElementById("visibility-signup");
        const success_div = document.getElementById('show-success-message')


        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phoneNo', phoneNo);
        formData.append('password', password);
        formData.append('file', upic);


        try {
            const response = await fetch('http://localhost:3000/signup/user', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json();


            if (data.msgType === 'name') {
                showError(name_error, name_, data)
                removeError(name_error, name_)
            } else if (data.msgType === 'email') {
                showError(email_error, email_, data)
                removeError(email_error, email_)
            } else if (data.msgType === 'password') {
                showError(password_error, password_, data, visibility)
                removeError(password_error, password_, visibility)
            } else if (data.msgType === 'phoneNo') {
                showError(phoneNo_error, phoneNo_, data)
                removeError(phoneNo_error, phoneNo_)
            } else {
                signupForm.reset()
                success_div.style.visibility ='visible'
                setTimeout(() => {
                    success_div.style.visibility ='hidden'
                }, 2000);

            }
        }
        catch (err) {
            console.log(err.message);
        }

    })
}


// for signin user--------------
function onloadUser() {

    // for user signin , to connect to api

    const signinForm = document.getElementById('signin-form');
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formDataSignin = new FormData(signinForm)
        const objData = Object.fromEntries(formDataSignin);

        const response = await fetch('http://localhost:3000/signin/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objData)
        })

        const emailInput = document.getElementById('signin-email');
        const emailError = document.getElementById('signin-error');

        const passwordInput = document.getElementById('signin-password');
        const passwordError = document.getElementById('password-error');
        const visibility = document.getElementById('visibility');

        const data = await response.json();

        if (data.type === 'email') {
            showError(emailError, emailInput, data)
            removeError(emailError, emailInput)
        }
        else if (data.type === 'password') {
            showError(passwordError, passwordInput, data, visibility)
            removeError(passwordError, passwordInput, visibility)
        }
        else {
            // console.log(data);
            window.location.href = '/home'
        }
    })
}

// show messages for user signup

function showMsg(err, msg, symbol, value, color) {
    err.innerHTML = msg
    err.style.color = color
    symbol.innerHTML = value
    symbol.style.color = color
    return;
}

// show error for user signin

function showError(typeError, typeInput, msg, visibility) {
    typeError.innerHTML = 'error'
    typeInput.value = msg.msg;
    typeInput.style.color = 'red';
    typeInput.type = 'text'
    typeInput.setAttribute('readonly', 'readonly')
    typeInput.removeAttribute('required');
    if (visibility) {
        visibility.style.display = 'none'
    }
}

// remove error for user signin

function removeError(typeError, typeInput, visibility) {
    setTimeout(() => {
        typeError.innerHTML = ''
        typeInput.value = '';
        typeInput.style.color = 'black';
        typeInput.setAttribute('required', 'required')
        typeInput.removeAttribute('readonly');
        if (visibility) {
            visibility.style.display = 'block'
        }
    }, 2000);
}


// for the visisbility of password for signup

function changeSignIn() {
    let password = document.getElementById("signin-password");
    let visibilitySpan = document.getElementById("visibility");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = "text";
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}

// for the visisbility of password for signin

function changeSignUp() {
    let password = document.getElementById("signup-password");
    let visibilitySpan = document.getElementById("visibility-signup");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = 'text';
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}


// to get user data 

async function getuserData(userId) {
    const response = await fetch(`http://localhost:3000/user?id=${userId}`)
    const data = await response.json();
    return data;
}

// to load home page
async function homeLoaded() {
    // to get data to edit form
    const btn = document.getElementById('edit-user');

    btn.addEventListener('click', async () => {

        const userId = btn.getAttribute('user-id')
        const data = await getuserData(userId);

        const form = document.getElementById('user-edit-form');
        form[0].value = data.user.name;
        form[1].value = data.user.email;
        form[2].value = data.user.phoneNo;

        // to edit user details from home by user

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('uname-edit').value
            const email = document.getElementById('uemail-edit').value
            const phoneNo = document.getElementById('uphoneNo-edit').value
            const password = document.getElementById('upassword-edit').value
            const upic = document.getElementById('upic-edit').files[0];

            const msg_p_edit = document.getElementById('msg-p-edit')
            const msg_symb_edit = document.getElementById('msg-symb-edit');

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phoneNo', phoneNo);
            formData.append('password', password);
            formData.append('file', upic);
            formData.append('ogEmail', data.user.email)


            try{
                const resp = await fetch('http://localhost:3000/user', {
                method: 'PATCH',
                body: formData,
            })

            const datas = await resp.json();

            if (datas.type == 'success') {
                showMsg(msg_p_edit, datas.msg, msg_symb_edit, 'check_circle', 'green')
                setTimeout(() => {
                    window.location.href = '/home'
                }, 1500)
            } else {
                showMsg(msg_p_edit, datas.msg, msg_symb_edit, 'error', 'red')
            }
            }catch(err)
            {
                showMsg(msg_p_edit, 'Network Error', msg_symb_edit, 'error', 'red')
            }

        })

    })
}

// to clear edit form user in home 

function clearUserEditForm() {
    const msg_p_edit = document.getElementById('msg-p-edit')
    const msg_symb_edit = document.getElementById('msg-symb-edit');
    msg_p_edit.innerHTML = ''
    msg_symb_edit.innerHTML = ''
}


// to show password in user edit form by user in home

function changeUserEdit() {
    let password = document.getElementById("upassword-edit");
    let visibilitySpan = document.getElementById("visibility");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = 'text';
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}

