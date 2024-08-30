// to signn in admin

function onloadAdmin() {
    const form = document.getElementById("admin-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email_error = document.getElementById("admin-email-error");
        const password_error = document.getElementById("admin-password-error");

        const email_type = document.getElementById("admin-email");
        const password_type = document.getElementById("admin-password");
        const visibility = document.getElementById("visibility-admin");

        const email = document.getElementById("admin-email").value;
        const password = document.getElementById("admin-password").value;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const objData = Object.fromEntries(formData);

        try {
            const response = await fetch("http://localhost:3000/signin/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(objData),
            });

            const data = await response.json();
            if (data.type == "email") {
                showError(email_error, email_type, data);
                removeError(email_error, email_type);
            } else if (data.type == "password") {
                showError(password_error, password_type, data, visibility);
                removeError(password_error, password_type, visibility);
            } else {
                window.location.href = "/admin";
            }
        } catch (err) {
            console.log(err.message);
        }
    });
}

// show error for admin signin

function showError(typeError, typeInput, msg, visibility) {
    typeError.innerHTML = "error";
    typeInput.value = msg.msg;
    typeInput.style.color = "red";
    typeInput.type = "text";
    typeInput.setAttribute("readonly", "readonly");
    typeInput.removeAttribute("required");
    if (visibility) {
        visibility.style.display = "none";
    }
}

// remove error for user admin signin

function removeError(typeError, typeInput, visibility) {
    setTimeout(() => {
        typeError.innerHTML = "";
        typeInput.value = "";
        typeInput.style.color = "black";
        typeInput.setAttribute("required", "required");
        typeInput.removeAttribute("readonly");
        if (visibility) {
            visibility.style.display = "block";
        }
    }, 2000);
}

// to add User

function addUser() {

    const addForm = document.getElementById('user-add-form')
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById(
            "uname-add-admin"
        ).value;
        const email = document.getElementById(
            "uemail-add-admin"
        ).value;
        const phoneNo = document.getElementById(
            "uphoneNo-add-admin"
        ).value;
        const password = document.getElementById(
            "upassword-add-admin"
        ).value;
        const upic = document.getElementById("upic-add-admin")
            .files[0];

        const msg_p = document.getElementById("msg-p-add");
        const msg_symb = document.getElementById("msg-symb-add");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNo", phoneNo);
        formData.append("password", password);
        formData.append("file", upic);

        const response = await fetch('http://localhost:3000/admin/user', {
            method: 'POST',
            body: formData
        })

        const data = await response.json();
        if (data.type === 'success') {
            showMsg(msg_p, data.msg, msg_symb, "check_circle", "green");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        } else {
            showMsg(msg_p, data.msg, msg_symb, "error", "red");
        }
    })

}

// to delete user

async function deleteUser(userId) {
    const userdata = await fetch(`http://localhost:3000/admin/user?id=${userId}`, {
        method: 'GET',
    });

    let data = await userdata.json();
    document.getElementById('delete-user-name').innerHTML = data.user.name;

    const deleteForm = document.getElementById('user-delete-form');
    deleteForm.addEventListener("submit", onDeleteUser);

    async function onDeleteUser(e) {

        const msg_p = document.getElementById("msg-p-delete");
        const msg_symb = document.getElementById("msg-symb-delete");

        e.preventDefault();

        try {
            const resp = await fetch(
                `http://localhost:3000/admin/user?id=${userId}`,
                {
                    method: "DELETE",
                }
            );
            const msg = await resp.json();
            if (msg.type === "success") {
                showMsg(msg_p, msg.msg, msg_symb, "check_circle", "green");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1500);
            } else {
                showMsg(msg_p, msg.msg, msg_symb, "error", "red");
            }
        }
        catch (err) {
            console.log(err.message);
            showMsg(msg_p, 'Server Error', msg_symb, "error", "red");
        }
    }

    function removeDeleteUserListener() {
        deleteForm.removeEventListener("submit", onDeleteUser);
    }


    document.getElementById('deleteUserData').addEventListener('hidden.bs.modal', function (e) {
        removeDeleteUserListener();
    });

}

// to edit user

async function editUser(userId) {

        const userdata = await fetch(`http://localhost:3000/admin/user?id=${userId}`, {
            method: 'GET',
        })

        let data = await userdata.json();
        const editForm = document.getElementById("user-edit-Form");
        editForm[0].value = data.user.name;
        editForm[1].value = data.user.email;
        editForm[2].value = data.user.phoneNo;

        editForm.addEventListener("submit", onEditUser)

        // edit user cal back function
        async function onEditUser(e) {
            e.preventDefault();

            const name = document.getElementById(
                "uname-edit-admin"
            ).value;
            const email = document.getElementById(
                "uemail-edit-admin"
            ).value;
            const phoneNo = document.getElementById(
                "uphoneNo-edit-admin"
            ).value;

            const upic = document.getElementById("upic-edit-admin")
                .files[0];

            const msg_p = document.getElementById("msg-p-edit");
            const msg_symb = document.getElementById("msg-symb-edit");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phoneNo", phoneNo);
            formData.append("file", upic);
            formData.append("ogEmail", data.user.email);

            try {
                const response = await fetch("http://localhost:3000/admin/user", {
                    method: "PATCH",
                    body: formData,
                });

                const message = await response.json();

                if (message.type == "success") {
                    showMsg(msg_p, message.msg, msg_symb, "check_circle", "green");
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1500);
                } else {
                    showMsg(msg_p, message.msg, msg_symb, "error", "red");
                }
            }
            catch (err) {
                console.log(err.message);
                showMsg(msg_p, 'Server Error', msg_symb, "error", "red");
            }
        }

        function removeEditUserListener() {
            const editForm = document.getElementById("user-edit-Form");
            editForm.removeEventListener("submit", onEditUser);
        }


        document.getElementById('editUserData').addEventListener('hidden.bs.modal', function (e) {
            removeEditUserListener();
        });

}

// show messages for user edit by admin

function showMsg(err, msg, symbol, value, color) {
    err.innerHTML = msg;
    err.style.color = color;
    symbol.innerHTML = value;
    symbol.style.color = color;
    return;
}

// to clear edit form

function clearUserEditFormByadmin(userId) {
    const msg_p = document.getElementById("msg-p-edit");
    const msg_symb = document.getElementById("msg-symb-edit");
    msg_p.innerHTML = "";
    msg_symb.innerHTML = "";
}

// to show password visibility in signin page

function changeUserAdd() {
    let password = document.getElementById("upassword-add-admin");
    let visibilitySpan = document.getElementById("visibility");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = 'text';
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}

// to show password visibility in add user form

function changePasswordVisisbility() {
    let password = document.getElementById("admin-password");
    let visibilitySpan = document.getElementById("visibility-admin");

    if (password.type === "password") {
        visibilitySpan.innerHTML = "visibility";
        password.type = 'text';
    } else {
        visibilitySpan.innerHTML = "visibility_off";
        password.type = "password";
    }
}

// to clear add user form

function clearAddUserForm() {
    const addForm = document.getElementById('user-add-form');
    addForm.reset();

    const msg_p = document.getElementById('msg-p-add')
    const msg_symb = document.getElementById('msg-symb-add');
    msg_p.innerHTML = ''
    msg_symb.innerHTML = ''
}
