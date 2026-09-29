const DASHBOARD_API = "http://localhost:5000/api/dashboard";

async function loadReports() {
    try {
        const response = await fetch(DASHBOARD_API);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.message || "Failed to load reports"
            );
        }

        const dashboard = data.dashboard;

        // Main report cards
        document.getElementById("totalIncome").textContent =
            `₹${Number(dashboard.totalIncome).toLocaleString("en-IN")}`;

        document.getElementById("totalExpense").textContent =
            `₹${Number(dashboard.totalExpense).toLocaleString("en-IN")}`;

        document.getElementById("netProfit").textContent =
            `₹${Number(dashboard.netProfit).toLocaleString("en-IN")}`;

        document.getElementById("totalPayments").textContent =
            `₹${Number(dashboard.totalPayments).toLocaleString("en-IN")}`;

        document.getElementById("totalCustomers").textContent =
            dashboard.totalCustomers;

        document.getElementById("totalInvoices").textContent =
            dashboard.totalInvoices;


        // Financial Summary
        document.getElementById("summaryIncome").textContent =
            `₹${Number(dashboard.totalIncome).toLocaleString("en-IN")}`;

        document.getElementById("summaryExpense").textContent =
            `₹${Number(dashboard.totalExpense).toLocaleString("en-IN")}`;

        document.getElementById("summaryProfit").textContent =
            `₹${Number(dashboard.netProfit).toLocaleString("en-IN")}`;


        // System Summary
        document.getElementById("summaryCustomers").textContent =
            dashboard.totalCustomers;

        document.getElementById("summaryInvoices").textContent =
            dashboard.totalInvoices;

        document.getElementById("summaryPayments").textContent =
            `₹${Number(dashboard.totalPayments).toLocaleString("en-IN")}`;

    } catch (error) {
        console.error("Reports Error:", error);

        const messageElement =
            document.getElementById("message");

        if (messageElement) {
            messageElement.textContent =
                "Unable to load finance reports.";
            messageElement.className =
                "message error";
        }
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadReports
);