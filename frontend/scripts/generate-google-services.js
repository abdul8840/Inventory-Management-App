const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const googleServicesPath = path.join(rootDir, 'android', 'app', 'google-services.json');
const packageName = 'com.inventorymobile';

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return env;
      }

      const separator = trimmed.indexOf('=');
      if (separator === -1) {
        return env;
      }

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed
        .slice(separator + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');

      env[key] = value;
      return env;
    }, {});
}

function isPlaceholder(value) {
  return !value || /your-|replace-|placeholder|000000/i.test(value);
}

function hasValidGoogleServices(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const client = json.client?.[0];
    const apiKey = client?.api_key?.[0]?.current_key;
    const appId = client?.client_info?.mobilesdk_app_id;
    const projectId = json.project_info?.project_id;

    return !isPlaceholder(apiKey) && !isPlaceholder(appId) && !isPlaceholder(projectId);
  } catch {
    return false;
  }
}

if (hasValidGoogleServices(googleServicesPath)) {
  console.log('Using existing android/app/google-services.json');
  process.exit(0);
}

const env = parseEnv(envPath);
const required = {
  FIREBASE_ANDROID_PROJECT_NUMBER: env.FIREBASE_ANDROID_PROJECT_NUMBER,
  FIREBASE_ANDROID_PROJECT_ID: env.FIREBASE_ANDROID_PROJECT_ID,
  FIREBASE_ANDROID_APP_ID: env.FIREBASE_ANDROID_APP_ID,
  FIREBASE_ANDROID_API_KEY: env.FIREBASE_ANDROID_API_KEY
};

const missing = Object.entries(required)
  .filter(([, value]) => isPlaceholder(value))
  .map(([key]) => key);

if (missing.length) {
  console.error(
    [
      'Firebase Android config is missing.',
      `Add these values to frontend/.env or replace ${googleServicesPath} with the real Firebase file:`,
      ...missing.map((key) => `- ${key}`),
      '',
      `Firebase Android package name must be: ${packageName}`
    ].join('\n')
  );
  process.exit(1);
}

const projectId = required.FIREBASE_ANDROID_PROJECT_ID;
const googleServices = {
  project_info: {
    project_number: required.FIREBASE_ANDROID_PROJECT_NUMBER,
    project_id: projectId,
    storage_bucket: env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`
  },
  client: [
    {
      client_info: {
        mobilesdk_app_id: required.FIREBASE_ANDROID_APP_ID,
        android_client_info: {
          package_name: packageName
        }
      },
      oauth_client: [],
      api_key: [
        {
          current_key: required.FIREBASE_ANDROID_API_KEY
        }
      ],
      services: {
        appinvite_service: {
          other_platform_oauth_client: env.GOOGLE_WEB_CLIENT_ID
            ? [
                {
                  client_id: env.GOOGLE_WEB_CLIENT_ID,
                  client_type: 3
                }
              ]
            : []
        }
      }
    }
  ],
  configuration_version: '1'
};

fs.writeFileSync(googleServicesPath, `${JSON.stringify(googleServices, null, 2)}\n`);
console.log('Generated android/app/google-services.json from frontend/.env');
