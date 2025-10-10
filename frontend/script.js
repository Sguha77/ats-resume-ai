const BACKEND_URL = "http://"; // change to deployed backend later

document.getElementById("scanButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("resumeFile");
  const jobDesc = document.getElementById("jobDescription").value.trim();
  const resultsDiv = document.getElementById("results");
  const loadingDiv = document.getElementById("loading");

  if (!fileInput.files[0]) {
    alert("Please upload a resume first!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    const resumeText = e.target.result;

    loadingDiv.style.display = "block";
    resultsDiv.innerHTML = "";

    try {
      const res = await fetch(`${BACKEND_URL}/api/resume/ai-suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDesc }),
      });

      const data = await res.json();
      loadingDiv.style.display = "none";

      if (data.improvedText) {
        resultsDiv.innerHTML = `
          <h3>✨ AI Resume Suggestions</h3>
          <pre>${data.improvedText}</pre>
        `;
      } else {
        resultsDiv.innerHTML = `<p style="color: orange;">${data.message || "No suggestions received."}</p>`;
      }

    } catch (error) {
      loadingDiv.style.display = "none";
      console.error("Error:", error);
      resultsDiv.innerHTML = `<p style="color: red;">Failed to analyze resume.</p>`;
    }
  };

  reader.readAsText(file);
});
