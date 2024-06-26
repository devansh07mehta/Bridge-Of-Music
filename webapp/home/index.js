const submitButton = document.getElementById('forgetsubmit');
document.getElementById('forgetform').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission
  submitButton.disabled = true;
  try {
    const res = await API.axios({
      method: 'POST',
      url: `${API.url()}/api/v1/auth/forget`,
      data: {
        username: document.getElementById('newusername').value,
        password: document.getElementById('resetpassword').value
      }
    });

    localStorage.setItem("token", res.data.token);
    // console.log(userDetails.data.token);
    // console.log("Username: " + userDetails.data.username);
    // console.log("Password: " + userDetails.data.password);

    var modalElement = document.getElementById('forgetModal');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);

    // If there's no instance, create one
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    // Close the modal
    document.getElementById('forgetform').reset();
    modalInstance.hide();
    // document.getElementById('forgetModal').close();

    iziToast.success({
      title: 'Password Updated',
      position: 'topCenter',
      timeout: 3500
    });
  }
  catch (err) {
    console.log(err);
    iziToast.error({
      title: 'Password Reset Failed',
      position: 'topCenter',
      timeout: 3500
    });

  }
  finally {
    submitButton.disabled = false;
  }
});


const registerbutton = document.getElementById('registersubmit');
document.getElementById("registerform").addEventListener("submit", async e => {
  e.preventDefault();

  // Lock Button
  registerbutton.disabled = true;

  try {

    const res = await API.axios({
      method: 'PUT',
      url: `${API.url()}/api/v1/auth/register`,
      data: {
        username: document.getElementById('username').value,
        password: document.getElementById('psw').value,
        vpaths: [
          "music-tracks"
        ],
        admin: false
      }
    });

    localStorage.setItem("token", res.data.token);
    // localStorage.setItem("isAdmin", res.data.admin); // Store admin status
    // console.log(res.data.admin);

    // if (res.data.admin == true) {
    //   window.location.assign(window.location.href.replace('/home', '/admin'));
    // }
    // else {
    //   window.location.assign(window.location.href.replace('/home', ''));
    // }

    var modalElement = document.getElementById('RegisterModal');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);

    // If there's no instance, create one
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    // Close the modal
    document.getElementById('registerform').reset();
    modalInstance.hide();

    iziToast.success({
      title: 'User Successfully Registered!',
      position: 'topCenter',
      timeout: 3500
    });


  } catch (err) {
    iziToast.error({
      title: 'User Registration failed!',
      position: 'topCenter',
      timeout: 3500
    });
  }
  finally {
    registerbutton.disabled = false;
  }
});


document.getElementById("login").addEventListener("submit", async e => {
  e.preventDefault();

  // Lock Button
  document.getElementById("form-submit").disabled = true;

  try {

    const res = await API.axios({
      method: 'POST',
      url: `${API.url()}/api/v1/auth/login`,
      data: {
        username: document.getElementById('email').value,
        password: document.getElementById('password').value,
      }
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("isAdmin", res.data.admin); // Store admin status

    if (res.data.admin == true) {
      window.location.assign(window.location.href.replace('/home', '/admin'));
    }
    else {
      window.location.assign(window.location.href.replace('/home', ''));
    }


    iziToast.success({
      title: 'Login Success!',
      position: 'topCenter',
      timeout: 3500
    });


  } catch (err) {
    iziToast.error({
      title: 'Invalid Login Credentials!',
      position: 'topCenter',
      timeout: 3500
    });
  }

  document.getElementById("form-submit").disabled = false;
});

function validatePasswordnew() {
  if (passwordnew.value != confirm_passwordnew.value) {
    confirm_passwordnew.setCustomValidity("Password doesn't match");
  } else {
    confirm_passwordnew.setCustomValidity('');
  }
}

var passwordnew = document.getElementById("resetpassword"), confirm_passwordnew = document.getElementById("confirm");

passwordnew.onchange = validatePasswordnew;
confirm_passwordnew.onkeyup = validatePasswordnew;

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Password doesn't match");
  } else {
    confirm_password.setCustomValidity('');
  }
}


var password = document.getElementById("psw"), confirm_password = document.getElementById("confirmpsw");

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function password_show_hide() {
  var x = document.getElementById("psw");
  var show_eye = document.getElementById("show_eye");
  var hide_eye = document.getElementById("hide_eye");
  hide_eye.classList.remove("d-none");
  if (x.type == "password") {
    x.type = "text";
    show_eye.style.display = "none";
    hide_eye.style.display = "block";
  }
  else {
    x.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}

function password_show_hide_new() {
  var x = document.getElementById("password");
  var show_eye = document.getElementById("show_eye1");
  var hide_eye = document.getElementById("hide_eye1");
  hide_eye.classList.remove("d-none");
  if (x.type == "password") {
    x.type = "text";
    show_eye.style.display = "none";
    hide_eye.style.display = "block";
  }
  else {
    x.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}

function password_show_hide_confirm() {
  var x = document.getElementById("confirm");
  var show_eye = document.getElementById("show1");
  var hide_eye = document.getElementById("hide1");
  hide_eye.classList.remove("d-none");
  if (x.type == "password") {
    x.type = "text";
    show_eye.style.display = "none";
    hide_eye.style.display = "block";
  }
  else {
    x.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}

function password_show_hide_confirm_new() {
  var x = document.getElementById("confirmpsw");
  var show_eye = document.getElementById("show");
  var hide_eye = document.getElementById("hide");
  hide_eye.classList.remove("d-none");
  if (x.type == "password") {
    x.type = "text";
    show_eye.style.display = "none";
    hide_eye.style.display = "block";
  }
  else {
    x.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}

function password_show_hide_reset() {
  var x = document.getElementById("resetpassword");
  var show_eye = document.getElementById("shownew");
  var hide_eye = document.getElementById("hidenew");
  hide_eye.classList.remove("d-none");
  if (x.type == "password") {
    x.type = "text";
    show_eye.style.display = "none";
    hide_eye.style.display = "block";
  }
  else {
    x.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}


