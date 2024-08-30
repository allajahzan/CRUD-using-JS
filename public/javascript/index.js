
function change() {
    let password = document.getElementById("signin-password");
    let visibilitySpan = document.getElementById("visibility");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = "text"; res.status(200).json({ email: email, password: password });
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}

function change2() {
    let password = document.getElementById("signup-password");
    let visibilitySpan = document.getElementById("visibility2");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = "text"; res.status(200).json({ email: email, password: password });
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}

function onloadUser() {
   
    //user login form submission-----------------------------------------

    const form = document.forms['signin-form'];
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const formData = new FormData(form);
            // const email = formData.get('email');
            // console.log(formData.get('email'));
            const formDataObject = Object.fromEntries(formData);
            // console.log(formDataObject);

            const response = await fetch('http://localhost:3000/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObject)
            });

            console.log(response);

            if (response.ok) {
                window.location.href = '/home';
            }
            else {

                const error = await response.json();
                const theError = error.error;

                if (error.data === "email") {
                    showEmailError(theError);

                    setTimeout(() => {
                        hideEmailError();
                    }, 2000);
                }
                else if (error.data === "password") {
                    showPasswordEror(theError);

                    setTimeout(() => {
                        hidePasswordError();
                    }, 2000);
                }
                else {

                    showEmailError(theError);

                    setTimeout(() => {
                        hideEmailError();
                    }, 2000);

                    showPasswordEror(theError);

                    setTimeout(() => {
                        hidePasswordError();
                    }, 2000);
                }

            }
        }
        catch (err) {

            document.getElementById('connection').style.display = 'block';
            setTimeout(() => {
                document.getElementById('connection').style.display = "none";
            }, 2000);

        }
    });
}

function showEmailError(theError) {
    const emailError = document.getElementById('error-symbol1');
    emailError.innerHTML = 'error'

    const inputTag = document.getElementById('signin-email');
    inputTag.value = '';
    inputTag.value = theError;
    inputTag.style.color = 'red'
    inputTag.removeAttribute('required')
    inputTag.setAttribute('readonly', 'readonly')
}

function hideEmailError() {
    const emailError = document.getElementById('error-symbol1');
    emailError.innerHTML = ''

    const inputTag = document.getElementById('signin-email');
    inputTag.value = '';
    inputTag.style.color = 'black'
    inputTag.removeAttribute('readonly')
    inputTag.setAttribute('required', 'required');
}

function showPasswordEror(theError) {
    const visibility = document.getElementById('visibility');
    visibility.style.display = 'none'

    const emailError = document.getElementById('error-symbol2');
    emailError.innerHTML = 'error'

    const inputTag = document.getElementById('signin-password');
    inputTag.type = 'type'
    inputTag.value = '';
    inputTag.value = theError;
    inputTag.style.color = 'red'
    inputTag.removeAttribute('required')
    inputTag.setAttribute('readonly', 'readonly')
}

function hidePasswordError() {
    const visibility = document.getElementById('visibility');
    visibility.style.display = '';

    const emailError = document.getElementById('error-symbol2');
    emailError.innerHTML = ''

    const inputTag = document.getElementById('signin-password');
    inputTag.type = 'password'
    inputTag.value = '';
    inputTag.style.color = 'black'
    inputTag.removeAttribute('readonly')
    inputTag.setAttribute('required', 'required');
}


// sett user name and email on home page

function home() {
    fetch('http://localhost:3000/getSessionData')
        .then(async (res) => {
            const data = await res.json();
            document.getElementById('userName').innerHTML = data.name;
            document.getElementById('userEmail').innerHTML = data.email;
            console.log(data);
        }).catch((err) => {
            console.log();
        })
}


const editbtn = document.getElementById('form-user-edit')
editbtn.addEventListener('submit',(e)=>{
    e.preventDefault();
    
})

const deletebtn = document.getElementById('form-user-delete')
deletebtn.addEventListener('submit',(e)=>{
    e.preventDefault();
    
})


