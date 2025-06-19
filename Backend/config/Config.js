const config = {
  local: {
    DB: {
      HOST: "mongo",
      PORT: "27017",
      DATABASE: "treatment-builder",
      USERNAME: "",
      PASSWORD: "",
    },
    email: {
      username: "",
      password: "",
      host: "smtp.gmail.com",
      port: 465,
    },
    PORT: 8055,
    BASE_PATH: "http://localhost:8055/",
  },
  development: {
    DB: {
      HOST: "localhost",
      PORT: "27017",
      DATABASE: "treatment-builder",
      USERNAME: "",
      PASSWORD: "",
      // USERNAME: "treatment-builder",
      // PASSWORD: "RJMtygb22vtGF",
    },
    email: {
      username: "",
      password: "",
      host: "smtp.gmail.com",
      port: 465,
    },
    PORT: 8055,
    BASE_PATH: "http://localhost:8055/",
  },
  staging: {
    DB: {
      HOST: "54.201.160.69",
      PORT: "58173",
      DATABASE: "treatmentbuilder",
      USERNAME: "treatmentbuilder",
      PASSWORD: "RJMtyBV22vtGFV",
    },
    email: {
      username: "",
      password: "",
      host: "smtp.gmail.com",
      port: 465,
    },
    PORT: 9247,
    // PORT: 8055,
    BASE_PATH: "http://54.201.160.69:9247/",
  },
  production: {
    DB: {
      HOST: "",
      PORT: "27017",
      DATABASE: "",
      USERNAME: "",
      PASSWORD: "",
    },
    email: {
      username: "",
      password: "",
      host: "",
      port: 465,
    },
    PORT: 8055,
  },
};
export const get = (env) => {
  return config[env];
};
