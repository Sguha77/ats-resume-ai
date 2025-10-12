// frontend/auth.js

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://ats-resume-backend-jm00.onrender.com";

// REGISTER USER
async function registerUser() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error. Please check your connection.");
  }
}

// LOGIN USER
async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Invalid credentials.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error. Please check your connection.");
  }
}
