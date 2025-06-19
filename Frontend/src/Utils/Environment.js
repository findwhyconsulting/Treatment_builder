const environments = {
  local: {
    url: "http://localhost:8055/api/v1", // set you local url here
  },
  staging: {
    url: "https://ss.stagingsdei.com:9247/api/v1", // Set your staging URL here
  },
  production: {
    url: "https://production-url.com/api/v1", // Set your production URL here
  },
};

const currentEnv = process.env.REACT_APP_ENV || "local"; // Default to local if not set

export const apiUrl = environments[currentEnv].url;
