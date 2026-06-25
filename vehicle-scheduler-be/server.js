const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3010;

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyNGIwNWEwNTEzQHN2ZWN3LmVkdS5pbiIsImV4cCI6MTc4MjM3OTc3MCwiaWF0IjoxNzgyMzc4ODcwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGNiOGVjZDctZThmZC00N2JiLTlhNjktYmU2ZTg4ZjM0MDQzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hpcmlzaGEiLCJzdWIiOiIzNmIwMDRhZC0xNzBmLTQyNzctODU1YS01ZGU5OGZmYTZjOGQifSwiZW1haWwiOiIyNGIwNWEwNTEzQHN2ZWN3LmVkdS5pbiIsIm5hbWUiOiJzaGlyaXNoYSIsInJvbGxObyI6IjI0YjA1YTA1MTMiLCJhY2Nlc3NDb2RlIjoiYWhYanZwIiwiY2xpZW50SUQiOiIzNmIwMDRhZC0xNzBmLTQyNzctODU1YS01ZGU5OGZmYTZjOGQiLCJjbGllbnRTZWNyZXQiOiJ6TXVESEhueFBRVWd5R1hDIn0.HD6zNXY02f5sVSIUI3m691mPri63YLeViMjj4h2ndOs";

async function fetchDepots() {
    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/depots",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.depots;
}

async function fetchVehicles() {
    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/vehicles",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.vehicles;
}

function optimizeVehicles(vehicles, maxHours) {
    const dp = Array(maxHours + 1).fill(0);

    for (const vehicle of vehicles) {
        const duration = vehicle.Duration;
        const impact = vehicle.Impact;

        for (let h = maxHours; h >= duration; h--) {
            dp[h] = Math.max(
                dp[h],
                dp[h - duration] + impact
            );
        }
    }

    return dp[maxHours];
}

app.get("/schedule", async (req, res) => {
    try {
        const depots = await fetchDepots();
        const vehicles = await fetchVehicles();

        const result = depots.map((depot) => ({
            depotId: depot.ID,
            maxImpact: optimizeVehicles(
                vehicles,
                depot.MechanicHours
            )
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});