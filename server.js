require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Load token from .env file
const REPO = "markenty/wallet"; // Your GitHub repository name
const BRANCH = "main"; // Branch name

// API to handle file upload
app.post("/upload", async (req, res) => {
  const { fileName, fileContent } = req.body;

  if (!fileName || !fileContent) {
    return res.status(400).json({ error: "fileName and fileContent are required" });
  }

  const url = `https://api.github.com/repos/${REPO}/contents/images/${fileName}`;
  const body = {
    message: `Upload ${fileName}`,
    content: fileContent, // Base64 encoded content
    branch: BRANCH,
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.message });
    }

    const result = await response.json();
    res.json({ success: true, downloadUrl: result.content.download_url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file to GitHub" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
