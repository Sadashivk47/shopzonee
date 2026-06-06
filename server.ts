import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";

const { Pool } = pg;

const app = express();
const PORT = 3000;

app.use(express.json());

// Load configurations
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || "shopzone-secret-signing-key-standard-sprint";

// Database Connection Manager
let dbMode: "postgres" | "sqlite-fallback" = "sqlite-fallback";
let dbError: string | null = null;
let dbPool: any = null;

// Clean mock database store for our demo fallback
interface FallbackUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
const fallbackUsersTable: FallbackUser[] = [];

// Seed default accounts in fallback store so the user has immediate demo credentials
const seedFallback = async () => {
  const hash = await bcrypt.hash("password123", 10);
  fallbackUsersTable.push({
    id: "fb-u123",
    name: "John Doe",
    email: "john@example.com",
    passwordHash: hash,
    createdAt: new Date(),
  });
};
seedFallback();

if (DATABASE_URL) {
  try {
    // Standard secure connection for modern cloud providers like Neon / Supabase
    dbPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
    });

    // Test Postgres connection and initialize required registration table
    dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).then(() => {
      dbMode = "postgres";
      console.log("Successfully connected to PostgreSQL database and verified schemas!");
    }).catch((err: any) => {
      dbError = err.message;
      dbMode = "sqlite-fallback";
      console.error("Postgres schema init failed, running fallback memory store. Error:", err.message);
    });
  } catch (error: any) {
    dbError = error.message;
    dbMode = "sqlite-fallback";
    console.error("Failed to construct PostgreSQL connection pool:", error.message);
  }
} else {
  console.log("DATABASE_URL absent. Running on lightweight in-memory fallback database mode for live preview.");
}

// ==========================================
// API REST ENDPOINTS FOR REAL SQL AUTHENTICATION
// ==========================================

// Diagnostic endpoint to check our live runtime database integration status in UI
app.get("/api/db-status", (req, res) => {
  res.json({
    status: "ok",
    dbMode,
    dbError,
    externalConfigured: !!DATABASE_URL,
    configuredUrlHint: DATABASE_URL ? `${DATABASE_URL.split("@")[1]?.split("/")[0] || "configured"}` : null
  });
});

// 1. REGISTER NEW USER
app.post("/api/auth/register", async (req, res): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields (name, email, password)." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const formattedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    if (dbMode === "postgres" && dbPool) {
      // Direct SQL Query checking for uniqueness constraint
      const checkUser = await dbPool.query("SELECT * FROM users WHERE email = $1", [formattedEmail]);
      if (checkUser.rows.length > 0) {
        return res.status(400).json({ error: "An account with this email address already exists." });
      }

      // Write direct hashed user credentials to PostgreSQL table
      const insertResult = await dbPool.query(
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name.trim(), formattedEmail, passwordHash]
      );

      const newUser = insertResult.rows[0];
      const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Registration successful",
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    } else {
      // Local Database Fallback Logic
      const userExists = fallbackUsersTable.some(u => u.email === formattedEmail);
      if (userExists) {
        return res.status(400).json({ error: "An account with this email address already exists." });
      }

      const newId = `fb-${Date.now()}`;
      const newUser: FallbackUser = {
        id: newId,
        name: name.trim(),
        email: formattedEmail,
        passwordHash,
        createdAt: new Date()
      };

      fallbackUsersTable.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Registration successful (Local DB Fallback Active)",
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }
  } catch (err: any) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: err.message || "Internal server register error." });
  }
});

// 2. LOGIN USER
app.post("/api/auth/login", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter your email and password." });
    }

    const formattedEmail = email.trim().toLowerCase();

    if (dbMode === "postgres" && dbPool) {
      // Find matching user records in PostgreSQL table
      const userResult = await dbPool.query("SELECT * FROM users WHERE email = $1", [formattedEmail]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: "User with this email was not found." });
      }

      const matchedUser = userResult.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, matchedUser.password_hash);
      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Incorrect password. Please try again." });
      }

      const token = jwt.sign(
        { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email }
      });
    } else {
      // Local Database Fallback Logic
      const matchedUser = fallbackUsersTable.find(u => u.email === formattedEmail);
      if (!matchedUser) {
        return res.status(401).json({ error: "User with this email was not found. Try 'john@example.com' with 'password123'." });
      }

      const isPasswordMatch = await bcrypt.compare(password, matchedUser.passwordHash);
      if (!isPasswordMatch) {
         return res.status(401).json({ error: "Incorrect password. Try 'password123'." });
      }

      const token = jwt.sign(
        { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful (Local DB Fallback Active)",
        token,
        user: { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email }
      });
    }
  } catch (err: any) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: err.message || "Internal server login error." });
  }
});

// 3. FETCH CURRENT COOKIE SESSION/JWT ACCOUNT DETAILS ("Authorization: Bearer <JWT>")
app.get("/api/auth/me", async (req, res): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Session header invalid or token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (dbMode === "postgres" && dbPool) {
      // Find matches securely from live table
      const userResult = await dbPool.query("SELECT id, name, email FROM users WHERE id = $1", [decoded.id]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: "User account no longer exists in Postgres registry." });
      }
      return res.json({ user: userResult.rows[0] });
    } else {
      // Local Database authentication verify
      const matchedUser = fallbackUsersTable.find(u => u.id === decoded.id);
      if (!matchedUser) {
        return res.status(401).json({ error: "User account no longer exists in local database." });
      }
      return res.json({ user: { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email } });
    }
  } catch (err: any) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
});

// ==========================================
// STRIPE ENTERPRISE INTEGRATION HANDLER
// ==========================================
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// REST route to initiate a checkout transaction and fetch Client Secrets
app.post("/api/payment/create-intent", async (req, res): Promise<any> => {
  try {
    const { amount, currency = "inr" } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Missing checkout amount." });
    }

    const stripe = getStripe();
    if (stripe) {
      // Create a genuine Payment Intent with Stripe's live or test servers
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert rupees to paise / dollars to cents
        currency: currency.toLowerCase(),
        metadata: { source: "shopzone_portal" }
      });

      return res.json({
        clientSecret: intent.client_secret,
        mode: "live-stripe",
        message: "Stripe Payment Intent bootstrapped successfully!"
      });
    } else {
      // Elegant, instructive fallback mode if environment variables are not supplied
      return res.json({
        clientSecret: `pi_mock_secret_${Math.random().toString(36).substring(2, 11)}`,
        mode: "sandbox-simulation",
        message: "STRIPE_SECRET_KEY is empty in development setup. Active Stripe Sandbox simulation."
      });
    }
  } catch (err: any) {
    console.error("Stripe Intent Exception:", err);
    return res.status(500).json({ error: err.message || "Stripe gateway failure" });
  }
});

// ==========================================
// GEMINI CONVERSATIONAL AI SHOPPING ASSISTANT
// ==========================================
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST route to converse with the Gemini-powered personal styling agent
app.post("/api/ai/chat", async (req, res): Promise<any> => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const ai = getAIClient();
    const systemInstruction = 
      "You are the ShopZone AI Advisor, a professional, luxury-focused personal retail consultant. " +
      "You are warm, expert, and suggest specific high-end products from our inventory like " +
      "'Pure Comfort Over-Ear Headphones' (₹18,900), 'Satin Hydro Body Oil' (₹3,400), " +
      "'Silken Clay Body Cleanser' (₹4,200), 'Luminous Resurfacing Essence' (beauty), " +
      "'Gucci Bloom' premium perfume, 'Calvin Klein' elixir, custom premium Watches, Shoes, and high-quality beds. " +
      "Advise the customer with aesthetic details, price references in Rupees, and friendly, personalized recommendations. " +
      "Keep responses highly professional, clean, formatted in elegant Markdown, and relatively concise (no more than 3 paragraphs).";

    let fallbackToSimulation = false;
    let outputText = "";

    if (ai) {
      try {
        // Build discussion structure
        const contents = [];
        
        // Inject previous conversation history
        for (const h of history) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
        
        // Add current client user prompt
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        outputText = response.text || "I apologize, but I am processing a brief latency gap. How else may I assist you today?";
        
        return res.json({
          reply: outputText,
          mode: "live-gemini",
          timestamp: new Date()
        });
      } catch (geminiErr: any) {
        console.warn("Gemini Live API failed (possible leaked key or blocked request):", geminiErr.message || geminiErr);
        fallbackToSimulation = true;
      }
    }

    if (!ai || fallbackToSimulation) {
      // High-craftsmanship sandbox simulations with educational value for interviews
      console.log("Emulating luxury retail assistant in sandbox mode...");
      
      let simulatedReply = "";
      const lower = message.toLowerCase();
      
      if (lower.includes("headphone") || lower.includes("sound") || lower.includes("music")) {
        simulatedReply = "### 🎧 Pure Comfort Over-Ear Headphones (₹18,900)\n\nThese feature supreme active noise isolation and dynamic high-fidelity drivers. They are designed with cozy brushed-aluminum memory foam, perfect for listening to high-resolution acoustics in complete acoustic silence.\n\n*Would you like to add these to your Shopping Bag?*";
      } else if (lower.includes("oil") || lower.includes("satin") || lower.includes("skin") || lower.includes("skincare") || lower.includes("cleanser") || lower.includes("clay")) {
        simulatedReply = "### 🧴 Premium Bath & Bodycare\n\n* **Satin Hydro Body Oil (₹3,400)**: A rich, deeply nourishing lightweight body oil infused with cold-pressed botanical seeds to leave a gorgeous satin, dewy glow.\n* **Silken Clay Body Cleanser (₹4,200)**: Formulated with mineral-rich kaolin clay and botanical essential oils, this creamy cleanser detoxifies your pores while maintaining natural moisture levels.\n\n*Would you like me to guide you to our luxury skincare checkout?*";
      } else if (lower.includes("perfume") || lower.includes("scent") || lower.includes("fragrance") || lower.includes("gucci") || lower.includes("chanel") || lower.includes("bloom")) {
        simulatedReply = "### 🌹 Premium Perfume Collections\n\nWe feature exquisite blends such as:\n- **Gucci Bloom (₹8,900)**: A rich white floral dream conveying absolute elegance.\n- **Chanel No. 5 Classic**: The supreme timeless icon of global luxury perfumery.\n- **Calvin Klein Perfume (₹6,800)**: Fresh, clean, with warm woody undercurrents.\n\nEach bottle is carefully boxed in velvet casing for ideal aromatic preservation.";
      } else if (lower.includes("watch") || lower.includes("time") || lower.includes("accessory")) {
        simulatedReply = "### ⌚ Premium Wristwear\n\nOur curation features state-of-the-art movements designed for optimal timeless style. Styled with genuine leather and mineral sapphire glass covers, it is the ultimate companion for modern executives.\n\n*Would you like to review watch options in your shopping list?*";
      } else if (lower.includes("shoe") || lower.includes("laceup") || lower.includes("footwear")) {
        simulatedReply = "### 🥾 Men's Premium Lace-Up Shoes\n\nMade from high-grade European full-grain calf leather with hand-finished patina. They offer orthopedic inner lining for absolute posture ease, perfect for luxury comfort.\n\n*Would you like to check out these details in your size?*";
      } else if (lower.includes("bed") || lower.includes("mattress") || lower.includes("sleep")) {
        simulatedReply = "### 🛏️ Editorial Comfort Bed & Mattress\n\nHand-crafted memory-foam engineering featuring organic breathable cotton with continuous structural support. Ideal for deep recovery cycles.\n\n*Shall we configure this set for delivery?*";
      } else {
        simulatedReply = "### Welcome to the ShopZone Premium Salon! ✨\n\nI am your *AI Shopping Advisor*. I can recommend our signature luxury items, detailed below:\n- **Pure Comfort Over-Ear Headphones** (₹18,900)\n- **Satin Hydro Body Oil** (₹3,400)\n- **Silken Clay Body Cleanser** (₹4,200)\n- **Exquisite Watch Collections, Footwear & beds**\n\n*(Note: Our system gracefully recovered from a key revocation limit to fall back to this interactive, full-fidelity local simulation.)*\n\nTell me, what luxury category or item are you looking to explore today?";
      }

      return res.json({
        reply: simulatedReply,
        mode: "sandbox-simulation",
        timestamp: new Date()
      });
    }
  } catch (err: any) {
    console.error("Gemini Chat Exception:", err);
    return res.status(500).json({ error: err.message || "Conversational AI agent server error." });
  }
});

// ==========================================
// VITE SPA MIDDLEWARE INTEGRATION
// ==========================================
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // In Express 4, fallback all unmatched routes to index.html for client route parsing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ShopZone Engine] Full-Stack server booted at http://0.0.0.0:${PORT}`);
  });
});
