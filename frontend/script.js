const API_BASE = "http://localhost:5000/api";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            window.location.href = "dashboard.html";  // Redirect after login
        } else {
            document.getElementById("error-msg").textContent = data.message;
        }
    } catch (error) {
        document.getElementById("error-msg").textContent = "Network error. Please try again.";
        console.error("Login error:", error);
    }
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    login();
});


