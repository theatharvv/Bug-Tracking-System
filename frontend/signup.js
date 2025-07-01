const API_BASE = "http://localhost:5000/api";

async function signup(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Reset previous messages
    const errorMsg = document.getElementById("error-msg");
    const successMsg = document.getElementById("success-msg");
    errorMsg.textContent = "";
    successMsg.textContent = "";

    // Validate inputs
    if (!name || !email || !password || !role) {
        errorMsg.textContent = "All fields are required";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();

        if (res.status === 201) {
            // Clear form
            document.getElementById("signupForm").reset();

            // Show success message
            successMsg.textContent = data.message || "Registration successful! Redirecting to login...";

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            // Show error message
            errorMsg.textContent = data.message || "Registration failed";
        }
    } catch (error) {
        console.error("Signup error:", error);
        errorMsg.textContent = "Network error. Please try again.";
    }
}

// Add event listener to form
document.getElementById("signupForm").addEventListener("submit", signup);