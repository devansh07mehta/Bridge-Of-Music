const menuBar = document.getElementById("menuBar");
const menuItems = document.getElementById("menuItems");
let menuLinks;
if (menuItems) {
  menuLinks = menuItems.querySelectorAll('a[href^="#"]');
  // Use menuLinks as needed
}

function setMobileHeight() {
  const home = document.getElementById("inner-home");
  const windowHeight = window.innerHeight;
  const vhInPixels = Math.round((5 / 100) * windowHeight);
  const documentHeight = document.documentElement.clientHeight;
  const actualHeight = Math.min(windowHeight, documentHeight);

  document.documentElement.style.setProperty(
    "--vh",
    `${windowHeight * 0.01}px`
  );

  // Set the height to 100% and use padding-bottom instead
  home.style.height = "100%";
  // home.style.paddingBottom = `${vhInPixels}px`;
}

// Rest of your code remains the same
setMobileHeight();
window.addEventListener("resize", setMobileHeight);
window.addEventListener("orientationchange", setMobileHeight);
window.visualViewport.addEventListener("resize", setMobileHeight);
setTimeout(setMobileHeight, 100);

document
  .getElementById("contactDetails")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get form values
    var fullName = document.getElementById("fn").value;
    var mobile = document.getElementById("mob").value;
    var email = document.getElementById("eid").value;
    var query = document.getElementById("qr").value;

    document.getElementById("fn").value = "";
    document.getElementById("mob").value = "";
    document.getElementById("eid").value = "";
    document.getElementById("qr").value = "";

    console.log(fullName, mobile, email, query);

    // Compose email body
    var templateParams = {
      fullName: fullName,
      mobile: mobile,
      email: email,
      query: query,
    };

    emailjs.send("service_gqqb26r", "template_t227mfc", templateParams).then(
      function (response) {
        console.log(
          "Email to admin sent successfully:",
          response.status,
          response.text
        );

        // Send auto-reply to user
        emailjs
          .send("service_gqqb26r", "template_att6llt", {
            to_email: email, // The user's email
            fullName: fullName,
            mobile: mobile,
            email: email,
            query: query,
          })
          .then(
            function (response) {
              console.log(
                "Auto-reply sent successfully:",
                response.status,
                response.text
              );
              alert("Query submitted successfully!");
            },
            function (error) {
              console.error("Error sending auto-reply:", error);
            }
          );
      },
      function (error) {
        console.error("Error sending email to admin:", error);
        alert("There was an error submitting the form. Please try again.");
      }
    );
  });
function closeMenu() {
  menuItems.classList.remove("menu-visible");
}

menuBar.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  menuItems.classList.toggle("menu-visible");
});

// Add click event listeners to all menu items
menuLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }

    closeMenu();
  });
});

// Optional: Close menu when clicking outside
document.addEventListener("click", function (event) {
  if (!menuBar.contains(event.target) && !menuItems.contains(event.target)) {
    closeMenu();
  }
});

// Optional: Close menu when clicking outside
document.addEventListener("click", function (event) {
  if (!menuBar.contains(event.target) && !menuItems.contains(event.target)) {
    menuItems.classList.remove("menu-visible");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll("#navNavbar .nav-item a");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'active' class from all nav items
      document
        .querySelectorAll("#navNavbar li.active")
        .forEach(function (item) {
          item.classList.remove("active");
        });

      // Add 'active' class to the parent li of the clicked link
      this.closest("li").classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll("#menuItems .nav-item a");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'active' class from all nav items
      document
        .querySelectorAll("#menuItems li.active")
        .forEach(function (item) {
          item.classList.remove("active");
        });

      // Add 'active' class to the parent li of the clicked link
      this.closest("li").classList.add("active");
    });
  });
});
const submitButton = document.getElementById("forgetsubmit");
document
  .getElementById("forgetform")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission
    submitButton.disabled = true;
    try {
      const res = await API.axios({
        method: "POST",
        url: `${API.url()}/api/v1/auth/forget`,
        data: {
          username: document.getElementById("newusername").value,
          password: document.getElementById("resetpassword").value,
        },
      });

      localStorage.setItem("token", res.data.token);
      // console.log(userDetails.data.token);
      // console.log("Username: " + userDetails.data.username);
      // console.log("Password: " + userDetails.data.password);

      var modalElement = document.getElementById("forgetModal");
      var modalInstance = bootstrap.Modal.getInstance(modalElement);

      // If there's no instance, create one
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }

      // Close the modal
      document.getElementById("forgetform").reset();
      modalInstance.hide();
      // document.getElementById('forgetModal').close();

      iziToast.success({
        title: "Password Updated",
        position: "topCenter",
        timeout: 3500,
      });
    } catch (err) {
      console.log(err);
      iziToast.error({
        title: "Password Reset Failed",
        position: "topCenter",
        timeout: 3500,
      });
    } finally {
      submitButton.disabled = false;
    }
  });

const registerbutton = document.getElementById("registersubmit");
document
  .getElementById("registerform")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lock Button
    registerbutton.disabled = true;

    try {
      const res = await API.axios({
        method: "PUT",
        url: `${API.url()}/api/v1/auth/register`,
        data: {
          username: document.getElementById("username").value,
          password: document.getElementById("psw").value,
          vpaths: ["music-tracks"],
          admin: false,
        },
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

      var modalElement = document.getElementById("RegisterModal");
      var modalInstance = bootstrap.Modal.getInstance(modalElement);

      // If there's no instance, create one
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }

      // Close the modal
      document.getElementById("registerform").reset();
      modalInstance.hide();

      iziToast.success({
        title: "User Successfully Registered!",
        position: "topCenter",
        timeout: 3500,
      });
    } catch (err) {
      iziToast.error({
        title: "User Registration failed!",
        position: "topCenter",
        timeout: 3500,
      });
    } finally {
      registerbutton.disabled = false;
    }
  });

// document.getElementById("login").addEventListener("click", () => {
//   if (res.data.admin == true) {
//     window.location.assign(window.location.href.replace("/home", "/admin"));
//   } else {
//     window.location.assign(window.location.href.replace("/home/", ""));
//   }
// });

// document.getElementById("login").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   // Lock Button
//   document.getElementById("form-submit").disabled = true;

//   try {
//     const res = await API.axios({
//       method: "POST",
//       url: `${API.url()}/api/v1/auth/login`,
//       data: {
//         username: document.getElementById("email").value,
//         password: document.getElementById("password").value,
//       },
//     });

//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("isAdmin", res.data.admin); // Store admin status

//     if (res.data.admin == true) {
//       window.location.assign(window.location.href.replace("/home", "/admin"));
//     } else {
//       window.location.assign(window.location.href.replace("/home/", ""));
//     }

//     iziToast.success({
//       title: "Login Success!",
//       position: "topCenter",
//       timeout: 3500,
//     });
//   } catch (err) {
//     iziToast.error({
//       title: "Invalid Login Credentials!",
//       position: "topCenter",
//       timeout: 3500,
//     });
//   }

//   document.getElementById("form-submit").disabled = false;
// });

function validatePasswordnew() {
  if (passwordnew.value != confirm_passwordnew.value) {
    confirm_passwordnew.setCustomValidity("Password doesn't match");
  } else {
    confirm_passwordnew.setCustomValidity("");
  }
}

var passwordnew = document.getElementById("resetpassword"),
  confirm_passwordnew = document.getElementById("confirm");

passwordnew.onchange = validatePasswordnew;
confirm_passwordnew.onkeyup = validatePasswordnew;

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Password doesn't match");
  } else {
    confirm_password.setCustomValidity("");
  }
}

var password = document.getElementById("psw"),
  confirm_password = document.getElementById("confirmpsw");

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
  } else {
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
  } else {
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
  } else {
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
  } else {
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
  } else {
    x.type = "password";
    show_eye.style.display = "block";
    hide_eye.style.display = "none";
  }
}

async function userlogin() {
  window.location.assign(
    window.location.href.replace(
      /\/home(\/?(#(home|about|features|services|contact))?)?/,
      "/instructions"
    )
  );
}

// Function to apply styles to the chatbot after it's loaded
function customizeChatbot() {
  const chatbotContainer = document.getElementById("chatbase-bubble-button");
  // const chatbotMain = document.querySelector(".group");

  if (chatbotContainer) {
    // Example: Center-align the chatbot
    if (document.querySelector(".content-wrapper").offsetWidth < 600) {
      chatbotContainer.style.bottom = "0.55rem";
      chatbotContainer.style.width = "13vw";
      chatbotContainer.style.height = "6vh";
    }
  } else {
    // If the chatbot container is not yet available, retry after a short delay
    setTimeout(customizeChatbot, 0);
  }
}

// Call the customize function after a short delay to allow the script to load
setTimeout(customizeChatbot, 0);
