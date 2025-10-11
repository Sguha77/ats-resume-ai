const BACKEND_URL = "https://ats-resume-backend-jm00.onrender.com/"; // change to deployed backend later

const fileInput = document.getElementById("resumeFile");
const scanButton = document.getElementById("scanButton");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const resultsDiv = document.getElementById("results");
const loadingDiv = document.getElementById("loading");

let uploadedFileName = "";

// 🟢 Handle file upload + show progress
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadedFileName = file.name;
  resultsDiv.innerHTML = `<p><strong>📄 File Uploaded:</strong> ${uploadedFileName}</p>`;

  progressContainer.style.display = "block";
  progressText.style.display = "block";

  // Smoothly animate from 0 → 100% to simulate upload completion
  let progress = 0;
  const uploadProgress = setInterval(() => {
    if (progress >= 100) {
      clearInterval(uploadProgress);
      progressBar.style.width = "100%";
      progressText.textContent = "100%";
    } else {
      progress += 10;
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }
  }, 80); // slightly faster so it looks smooth
});

// 🟣 Handle Scan Button Click
scanButton.addEventListener("click", async () => {
  const jobDesc = document.getElementById("jobDescription").value.trim();

  if (!fileInput.files[0]) {
    alert("Please upload a resume first!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadstart = () => {
    progressContainer.style.display = "block";
    progressText.style.display = "block";
    progressBar.style.width = "0%";
    progressText.textContent = "0%";
  };

  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}%`;
    }
  };

  reader.onload = async (e) => {
    const resumeText = e.target.result;

    // Complete bar when file fully loaded
    progressBar.style.width = "100%";
    progressText.textContent = "100%";

    loadingDiv.style.display = "block";
    resultsDiv.innerHTML = `<p><strong>📄 File Uploaded:</strong> ${uploadedFileName}</p>`;

    // ✅ FIX: Include token in header
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired or missing. Please log in again.");
      window.location.href = "login.html";
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}api/resume/ai-suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ added
        },
        body: JSON.stringify({ resumeText, jobDesc }),
      });

      const data = await res.json();
      loadingDiv.style.display = "none";

      if (data.improvedText) {
        resultsDiv.innerHTML += `
          <h3>✨ AI Resume Suggestions</h3>
          <pre>${data.improvedText}</pre>
        `;
      } else {
        resultsDiv.innerHTML += `<p style="color: orange;">${data.message || "No suggestions received."}</p>`;
      }

    } catch (error) {
      loadingDiv.style.display = "none";
      console.error("Error:", error);
      resultsDiv.innerHTML += `<p style="color: red;">Failed to analyze resume.</p>`;
    }
  };

  reader.readAsText(file);
});
