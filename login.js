import {
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";


const LOGIN_API =
    "http://localhost:5000/api/login";


const loginForm =
    document.getElementById("loginForm");

const loginBtn =
    document.getElementById("loginBtn");

const messageElement =
    document.getElementById("message");

const googleBtn =
    document.getElementById("googleBtn");

const rememberMe =
    document.getElementById("rememberMe");


/* =====================================
   NORMAL EMAIL + PASSWORD LOGIN
===================================== */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        if (!email || !password) {

            showMessage(
                "Please enter email and password.",
                "error"
            );

            return;
        }


        try {

            loginBtn.disabled = true;

            loginBtn.textContent =
                "Signing in...";


            const response =
                await fetch(
                    LOGIN_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Login failed"
                );

            }


            saveLoginData(
                data.token,
                data.user
            );


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(() => {
                window.location.href =
                    "index.html";
            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to login.",
                "error"
            );


        } finally {

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Sign In";

        }

    }
);


/* =====================================
   GOOGLE LOGIN
===================================== */

googleBtn.addEventListener(
    "click",
    async () => {

        try {

            googleBtn.disabled = true;

            googleBtn.textContent =
                "Connecting to Google...";


            const provider =
                new GoogleAuthProvider();


            const result =
                await signInWithPopup(
                    auth,
                    provider
                );


            const user =
                result.user;


            const firebaseToken =
                await user.getIdToken();


            const googleUser = {

                id:
                    user.uid,

                name:
                    user.displayName ||
                    "Google User",

                email:
                    user.email || "",

                role:
                    "Admin",

                photoURL:
                    user.photoURL || ""

            };


            /*
             * Save Firebase ID token
             * as the current portal token.
             *
             * Your existing auth.js checks
             * for finance_token before
             * opening protected pages.
             */

            if (rememberMe.checked) {

                localStorage.setItem(
                    "finance_token",
                    firebaseToken
                );

                localStorage.setItem(
                    "finance_user",
                    JSON.stringify(
                        googleUser
                    )
                );

            } else {

                sessionStorage.setItem(
                    "finance_token",
                    firebaseToken
                );

                sessionStorage.setItem(
                    "finance_user",
                    JSON.stringify(
                        googleUser
                    )
                );
            }


            showMessage(
                "Google login successful. Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 700);


        } catch (error) {

            console.error(
                "Google Sign-In error:",
                error
            );


            let message =
                "Google Sign-In failed.";


            if (
                error.code ===
                "auth/popup-closed-by-user"
            ) {

                message =
                    "Google Sign-In window was closed.";

            } else if (
                error.code ===
                "auth/popup-blocked"
            ) {

                message =
                    "Browser blocked the Google Sign-In popup.";

            } else if (
                error.code ===
                "auth/operation-not-allowed"
            ) {

                message =
                    "Google Sign-In is not enabled in Firebase Authentication.";

            }


            showMessage(
                message,
                "error"
            );


        } finally {

            googleBtn.disabled = false;

            googleBtn.innerHTML =
                `<span class="google-icon">G</span>
                 Continue with Google`;

        }

    }
);


/* =====================================
   SAVE LOGIN DATA
===================================== */

function saveLoginData(
    token,
    user
) {

    if (rememberMe.checked) {

        localStorage.setItem(
            "finance_token",
            token
        );

        localStorage.setItem(
            "finance_user",
            JSON.stringify(user)
        );

    } else {

        sessionStorage.setItem(
            "finance_token",
            token
        );

        sessionStorage.setItem(
            "finance_user",
            JSON.stringify(user)
        );
    }

}


/* =====================================
   MESSAGE
===================================== */

function showMessage(
    message,
    type
) {

    messageElement.textContent =
        message;

    messageElement.className =
        `message ${type}`;

}