console.log("Hello World!")// src/config.js

const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:7040"; // Local .NET API port
    } else {
        return ""; // Azure: use same domain, relative path
    }
};

export const API_BASE_URL = getBaseUrl();
