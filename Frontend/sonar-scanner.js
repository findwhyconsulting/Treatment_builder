const sonarqubeScanner = require('sonarqube-scanner').default || require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    token: process.env.SONAR_LOGIN_KEY,
    options: {
      'sonar.projectKey': 'TreatmentBuilderFrontend',
      'sonar.projectName': 'TreatmentBuilderFrontend',
      'sonar.sources': 'src', 
      'sonar.exclusions': 'node_modules/**, dist/**',
      'sonar.sourceEncoding': 'UTF-8',
    },
  },
  () => process.exit()
);
