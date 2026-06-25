const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyNGIwNWEwNTEzQHN2ZWN3LmVkdS5pbiIsImV4cCI6MTc4MjM3NjEzMywiaWF0IjoxNzgyMzc1MjMzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjBiNWIxNWYtYjVmOS00MmEzLThiMTgtOGM4N2YyZTE4OTgwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hpcmlzaGEiLCJzdWIiOiIzNmIwMDRhZC0xNzBmLTQyNzctODU1YS01ZGU5OGZmYTZjOGQifSwiZW1haWwiOiIyNGIwNWEwNTEzQHN2ZWN3LmVkdS5pbiIsIm5hbWUiOiJzaGlyaXNoYSIsInJvbGxObyI6IjI0YjA1YTA1MTMiLCJhY2Nlc3NDb2RlIjoiYWhYanZwIiwiY2xpZW50SUQiOiIzNmIwMDRhZC0xNzBmLTQyNzctODU1YS01ZGU5OGZmYTZjOGQiLCJjbGllbnRTZWNyZXQiOiJ6TXVESEhueFBRVWd5R1hDIn0.eqKXmsEAaB3NTdGRgx2wTT09TquTHFMX8ZYCGrBgRCY";

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logging Error:", error.response?.data || error.message);
  }
}

module.exports = Log;