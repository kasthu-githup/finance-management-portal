/* =========================================
   SIGNUP API
   Local → localhost backend
   Render → same domain /api
========================================= */

const SIGNUP_API =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000/api/signup"
        : "/api/signup";


/* =========================================
   DOM ELEMENTS
========================================= */

const signupForm =
    document.getElementById("signupForm");

const signupBtn =
    document.getElementById("signupBtn");

const messageElement =
    document.getElementById("message");

const googleBtn =
    document.getElementById("googleBtn");


/* =========================================
   SIGNUP FORM
========================================= */

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* -------------------------------
           Get Form Values
        ------------------------------- */

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;

        const terms =
            document
                .getElementById("terms")
                .checked;


        /* -------------------------------
           Validation
        ------------------------------- */

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Please fill all required fields.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters.",
                "error"
            );

            return;
        }


        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        if (!terms) {

            showMessage(
                "Please accept the registration terms.",
                "error"
            );

            return;
        }


        try {

            signupBtn.disabled = true;

            signupBtn.textContent =
                "Creating account...";


            /* -------------------------------
               API Request
            ------------------------------- */

            const response =
                await fetch(
                    SIGNUP_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


            /* -------------------------------
               Read Response
            ------------------------------- */

            const data =
                await response.json();


            /* -------------------------------
               Signup Failed
            ------------------------------- */

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Signup failed."
                );

            }


            /* -------------------------------
               Success
            ------------------------------- */

            showMessage(
                "Account created successfully. Redirecting...",
                "success"
            );


            signupForm.reset();


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


            /* -------------------------------
               Network Error
            ------------------------------- */

            if (
                error.name ===
                "TypeError"
            ) {

                showMessage(
                    "Unable to connect to the server. Please try again.",
                    "error"
                );

            } else {

                showMessage(
                    error.message ||
                    "Unable to create account.",
                    "error"
                );

            }


        } finally {

            signupBtn.disabled = false;

            signupBtn.textContent =
                "Create Account";

        }

    }
);


/* =========================================
   GOOGLE SIGN-IN
========================================= */

if (googleBtn) {

    googleBtn.addEventListener(
        "click",
        () => {

            showMessage(
                "Google Sign-In will be connected with Firebase.",
                "error"
            );

        }
    );

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(
    message,
    type
) {

    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    messageElement.className =
        `message ${type}`;

}