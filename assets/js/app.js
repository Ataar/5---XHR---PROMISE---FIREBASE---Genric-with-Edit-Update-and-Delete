let cl = console.log;

let signInForm = document.getElementById("signInForm");
let email = document.getElementById("email");
let password = document.getElementById("password");
let passwordToggle = document.getElementById('data');

const SnackBar = (msg, icon) => {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 1500,
    });
};

const signInObject = (eve) => {
    eve.preventDefault();

    let newObj = {
        emailIdVal: email.value,
        passwordVal: password.value,
    };

    signObjectApi(newObj);
};

const signObjectApi = (blog) => {
    // This function is used for API call to check email & password from database.
    setTimeout(() => {
        if (blog.emailIdVal === "mateen@gmail.com" && blog.passwordVal === "7058") {
            SnackBar("Login Successfully", "success");
            setTimeout(() => {
                window.location.href = "https://callback-function-dynamic.vercel.app/";
            }, 1500); // Redirect after the SnackBar timer
        } else {
            SnackBar("Invalid Email or Password", "error");
        }
        signInForm.reset();
    }, 1000);
};

const onPassword = () => {
    const isPasswordVisible = password.type === 'password';
    password.type = isPasswordVisible ? 'text' : 'password';  // here ternary operator is used as if else
    passwordToggle.classList.toggle('fa-eye-slash', isPasswordVisible); 
    passwordToggle.classList.toggle('fa-eye', !isPasswordVisible);     
    
    
    // if (isPasswordVisible) {
    //     passwordToggle.classList.add('fa-eye-slash')  // if input field is password means it is hidden so add "fa-eye-slash" class to visible input field value
    //     passwordToggle.classList.remove('fa-eye')
    //     password.type = 'text';
    // } else {
    //     passwordToggle.classList.add('fa-eye')     // if input field is text means it is visible so add 'fa-eye' class to hide input field value
    //     passwordToggle.classList.remove('fa-eye-slash')
    //     password.type = 'password';
    // }



};

signInForm.addEventListener("submit", signInObject);
passwordToggle.addEventListener('click', onPassword);
