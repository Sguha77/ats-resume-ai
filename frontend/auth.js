// frontend/script.js

const DASHBOARD_API = "http://";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token && window.location.pathname.endsWith("dashboard.html")) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  if (window.location.pathname.endsWith("dashboard.html")) {
    await loadResumes();
  }
});

async function loadResumes() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${DASHBOARD_API}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  const container = document.getElementById("resumeList");

  if (res.ok && data.resumes?.length) {
    container.innerHTML = data.resumes
      .map(
        (r) => `
      <div class="resume-card">
        <h3>${r.fileName}</h3>
        <p>Score: ${r.score || "N/A"}%</p>
        <p>Date: ${new Date(r.createdAt).toLocaleDateString()}</p>
      </div>`
      )
      .join("");
  } else {
    container.innerHTML = "<p>No resumes found yet. Upload one on the main page!</p>";
  }
}
