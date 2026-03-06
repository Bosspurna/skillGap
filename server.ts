import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";

dotenv.config();

const db = new Database("skillgap.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skills TEXT,
    interests TEXT,
    personality TEXT,
    cgpa REAL,
    target_career TEXT,
    score INTEGER,
    strengths TEXT,
    gaps TEXT,
    roadmap TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

  app.use(express.json());

  // --- Auth Routes ---
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const id = crypto.randomUUID();
      const hash = await bcrypt.hash(password, 10);
      db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").run(id, name, email, hash);
      res.status(201).json({ message: "User created", userId: id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- OAuth Routes ---
  app.get("/api/auth/url", (req, res) => {
    const { provider } = req.query;
    const redirectUri = `${process.env.APP_URL}/auth/callback`;

    if (provider === "google") {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account"
      });
      return res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
    }

    if (provider === "github") {
      const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: redirectUri,
        scope: "user:email"
      });
      return res.json({ url: `https://github.com/login/oauth/authorize?${params}` });
    }

    res.status(400).json({ error: "Invalid provider" });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    const redirectUri = `${process.env.APP_URL}/auth/callback`;

    if (!code) return res.status(400).send("No code provided");

    try {
      let email = "";
      let name = "";

      // We need to determine if it was Google or GitHub. 
      // For simplicity, we'll try to exchange with Google first, then GitHub if it fails, 
      // or better, we could have passed a state. 
      // Let's assume we can check the referrer or just try both.
      // Actually, a better way is to use a 'state' param, but for this demo let's try to detect.
      
      let userProfile: any = null;

      // Try Google
      try {
        const googleTokens = await axios.post("https://oauth2.googleapis.com/token", {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        });
        const googleUser = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${googleTokens.data.access_token}` }
        });
        email = googleUser.data.email;
        name = googleUser.data.name || googleUser.data.email.split('@')[0];
      } catch (e) {
        // Try GitHub
        const githubTokens = await axios.post("https://github.com/login/oauth/access_token", {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri
        }, { headers: { Accept: "application/json" } });

        const githubUser = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${githubTokens.data.access_token}` }
        });
        
        // GitHub might not return email in primary profile if it's private
        email = githubUser.data.email;
        if (!email) {
          const emails = await axios.get("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${githubTokens.data.access_token}` }
          });
          email = emails.data.find((e: any) => e.primary)?.email || emails.data[0]?.email;
        }
        name = githubUser.data.name || githubUser.data.login;
      }

      if (!email) throw new Error("Could not retrieve email from provider");

      // Check if user exists
      let user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (!user) {
        const id = crypto.randomUUID();
        // For OAuth users, we set a random password hash since they won't use it
        const hash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
        db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").run(id, name, email, hash);
        user = { id, name, email };
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
      const userData = JSON.stringify({ token, user: { id: user.id, name: user.name, email: user.email } });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', data: ${userData} }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("OAuth Error:", error.response?.data || error.message);
      res.status(500).send("Authentication failed: " + (error.response?.data?.error_description || error.message));
    }
  });

  // --- Assessment Routes ---
  app.post("/api/assessment/submit", (req, res) => {
    const { userId, skills, interests, personality, cgpa, targetCareer, score, strengths, gaps, roadmap } = req.body;
    try {
      const id = crypto.randomUUID();
      db.prepare(`
        INSERT INTO assessments (id, user_id, skills, interests, personality, cgpa, target_career, score, strengths, gaps, roadmap)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        JSON.stringify(skills),
        JSON.stringify(interests),
        personality,
        cgpa,
        targetCareer,
        score,
        JSON.stringify(strengths),
        JSON.stringify(gaps),
        JSON.stringify(roadmap)
      );
      res.json({ assessmentId: id, message: "Assessment saved" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/career/result", (req, res) => {
    const { userId } = req.query;
    try {
      const result: any = db.prepare("SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
      if (!result) return res.status(404).json({ error: "No assessment found" });
      
      res.json({
        career: result.target_career,
        score: result.score,
        strengths: JSON.parse(result.strengths),
        gaps: JSON.parse(result.gaps),
        roadmap: JSON.parse(result.roadmap)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user/profile", (req, res) => {
    const { userId } = req.query;
    try {
      const user: any = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assessment/roadmap/toggle", (req, res) => {
    const { userId, stepIndex } = req.body;
    try {
      const result: any = db.prepare("SELECT id, roadmap FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
      if (!result) return res.status(404).json({ error: "No assessment found" });
      
      const roadmap = JSON.parse(result.roadmap);
      if (roadmap[stepIndex]) {
        roadmap[stepIndex].completed = !roadmap[stepIndex].completed;
      }
      
      db.prepare("UPDATE assessments SET roadmap = ? WHERE id = ?").run(JSON.stringify(roadmap), result.id);
      res.json({ message: "Roadmap updated", roadmap });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
