const API_URL = "http://localhost:3000";

async function fetchLedger() {
    try {
        const response = await fetch(`${API_URL}/ledger`);
        const ledger = await response.json();
        displayLedger(ledger);
    } catch (error) {
        console.error("Error fetching ledger:", error);
    }
}

function displayLedger(ledger) {
    const totalCirculation = Object.values(ledger.users).reduce((sum, user) => sum + user.balance, 0);
    document.getElementById("total-circulation").innerText = `Total Circulation: 💰 x ${totalCirculation}`;

    const ledgerContainer = document.querySelector("#transaction-ledger ul");
    ledgerContainer.innerHTML = "";

    ledger.transactions.forEach((tx) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>From:</strong> ${tx.sender} <br>
                              <strong>To:</strong> ${tx.receiver} <br>
                              <strong>Amount:</strong> ${tx.amount} <br>
                              <strong>Timestamp:</strong> ${tx.timestamp}`;
        ledgerContainer.appendChild(listItem);
    });
}

async function submitTransaction() {
    const sender = document.getElementById("sender").value;
    const receiver = document.getElementById("receiver").value;
    const amount = parseInt(document.getElementById("amount").value, 10);

    if (!sender || !receiver || !amount || amount <= 0) {
        alert("Invalid input");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender, receiver, amount }),
        });

        const result = await response.json();
        if (result.message) {
            alert(result.message);
            fetchLedger(); // Refresh ledger
        } else {
            alert("Transaction failed");
        }
    } catch (error) {
        console.error("Error submitting transaction:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchLedger);
