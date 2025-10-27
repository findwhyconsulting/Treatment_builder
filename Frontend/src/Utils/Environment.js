const environments = {
  local: {
    url: "http://209.38.88.129:9247/api/v1", // Updated to match the running backend server
  },
  staging: {
    url: "http://209.38.88.129:9247/api/v1/", // Set your staging URL here
  },
  production: {
    url: "https://production-url.com/api/v1", // Set your production URL here
  },
};

const currentEnv = process.env.REACT_APP_ENV || "local"; // Default to local if not set

export const apiUrl = environments[currentEnv].url;
