const SIGNUP_API = "http://localhost:5000/api/signup";

const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const messageElement = document.getElementById("message");
const googleBtn = document.getElementById("googleBtn");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    if (!name || !email || !password || !confirmPassword) {
        showMessage("Please fill all required fields.", "error");
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

        const response = await fetch(SIGNUP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Signup failed"
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
            error.message || "Unable to create account.",
            "error"
        );

    } finally {

        signupBtn.disabled = false;
        signupBtn.textContent = "Create Account";
    }
});


googleBtn.addEventListener("click", () => {

    showMessage(
        "Google Sign-In will be connected with Firebase in the next step.",
        "error"
    );

});


function showMessage(message, type) {

    messageElement.textContent = message;

    messageElement.className =
        `message ${type}`;

}