import {
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";


/* =========================================
   SIGNUP API
========================================= */

const SIGNUP_API =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000/api/signup"
        : "/api/signup";


/* =========================================
   DOM ELEMENTS
========================================= */

const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const messageElement = document.getElementById("message");
const googleBtn = document.getElementById("googleBtn");


/* =========================================
   EMAIL + PASSWORD SIGNUP
========================================= */

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;


    if (!name || !email || !password || !confirmPassword) {
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


    if (password !== confirmPassword) {
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
        signupBtn.textContent = "Creating account...";


        const response = await fetch(
            SIGNUP_API,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Signup failed."
            );
        }


        showMessage(
            "Account created successfully. Redirecting...",
            "success"
        );


        signupForm.reset();


        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);


    } catch (error) {

        console.error("Signup error:", error);

        showMessage(
            error.message ||
            "Unable to create account.",
            "error"
        );

    } finally {

        signupBtn.disabled = false;
        signupBtn.textContent = "Create Account";

    }

});


/* =========================================
   GOOGLE SIGN-IN
========================================= */

googleBtn.addEventListener("click", async () => {

    try {

        googleBtn.disabled = true;

        googleBtn.textContent =
            "Connecting to Google...";


        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        const result =
            await signInWithPopup(
                auth,
                provider
            );


        const user = result.user;


        const firebaseToken =
            await user.getIdToken();


        const googleUser = {

            id: user.uid,

            name:
                user.displayName ||
                "Google User",

            email:
                user.email ||
                "",

            role: "Admin",

            photoURL:
                user.photoURL ||
                ""

        };


        localStorage.setItem(
            "finance_token",
            firebaseToken
        );


        localStorage.setItem(
            "finance_user",
            JSON.stringify(googleUser)
        );


        sessionStorage.removeItem(
            "finance_token"
        );

        sessionStorage.removeItem(
            "finance_user"
        );


        showMessage(
            "Google Sign-In successful. Redirecting...",
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


        if (error.code === "auth/unauthorized-domain") {

            message =
                "This Render domain is not authorized in Firebase.";

        } else if (
            error.code === "auth/popup-closed-by-user"
        ) {

            message =
                "Google Sign-In window was closed.";

        } else if (
            error.code === "auth/popup-blocked"
        ) {

            message =
                "Browser blocked the Google Sign-In popup.";

        } else if (
            error.code === "auth/operation-not-allowed"
        ) {

            message =
                "Google Sign-In is not enabled in Firebase.";

        } else if (
            error.code === "auth/network-request-failed"
        ) {

            message =
                "Network error. Please check your internet connection.";

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

});


/* =========================================
   MESSAGE
========================================= */

function showMessage(message, type) {

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;

    messageElement.className =
        `message ${type}`;

}