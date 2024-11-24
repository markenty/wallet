const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Path to the ledger
const ledgerPath = "./data/ledger.json";

// Utility: Load ledger
function loadLedger() {
  return JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
}

// Utility: Save ledger
function saveLedger(data) {
  fs.writeFileSync(ledgerPath, JSON.stringify(data, null, 2));
}

// Route: Get Ledger
app.get("/ledger", (req, res) => {
  try {
    const ledger = loadLedger();
    res.status(200).json(ledger);
  } catch (error) {
    res.status(500).json({ error: "Unable to read ledger" });
  }
});

// Route: Submit Transaction
app.post("/transaction", (req, res) => {
  const { sender, receiver, amount } = req.body;

  if (!sender || !receiver || !amount) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }

  try {
    const ledger = loadLedger();
    const timestamp = new Date().toISOString();

    // Add new transaction
    ledger.transactions.push({ sender, receiver, amount, timestamp });

    // Update sender and receiver balances
    ledger.users[sender].balance -= amount;
    ledger.users[receiver].balance += amount;

    // Save ledger
    saveLedger(ledger);

    res.status(200).json({ message: "Transaction added successfully", ledger });
  } catch (error) {
    res.status(500).json({ error: "Failed to process transaction" });
  }
});

// Route: Validate Ledger
app.get("/validate", (req, res) => {
  try {
    const ledger = loadLedger();
    const isValid = validateLedger(ledger);
    res.status(200).json({ isValid });
  } catch (error) {
    res.status(500).json({ error: "Validation failed" });
  }
});

function validateLedger(ledger) {
  // Implement your validation logic here
  return true; // Example always returns valid
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
