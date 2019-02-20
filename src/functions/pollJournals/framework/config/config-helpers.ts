import { SecretsManager } from 'aws-sdk';
import { get } from 'lodash';

export const defaultIfNotPresent = (value: string | null | undefined, defaultValue: string) => {
  if (!value || value.trim().length === 0) {
    return defaultValue;
  }
  return value;
};

export const throwIfNotPresent = (value: string | null | undefined, configKey: string) => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Configuration item ${configKey} was not provided with a value`);
  }
  return value;
};

let secretsManagerConfig: { [key: string]: string } = {};
const tryBootstrapSecretsManager = async () => {
  return new Promise((resolve, reject) => {
    const secretName = process.env.ASM_SECRET_NAME;
    if (secretName && secretName.trim().length > 0) {
      console.debug(`Fetching secret named ${secretName} from ASM...`);
      const client = new SecretsManager({ region: process.env.AWS_REGION });
      client.getSecretValue({ SecretId: secretName }, (err, secretsManagerResponse) => {
        if (err || !secretsManagerResponse) {
          console.log(err);
          reject(err);
        }
        secretsManagerConfig = JSON.parse(secretsManagerResponse.SecretString || '{}');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const secretsManagerConfigValid = (
  secretName: string | undefined,
  secretKey: string | undefined,
) => {
  const secretNameValid = secretName && secretName.trim().length > 0;
  const secretKeyValid = secretKey && secretKey.trim().length > 0;
  return secretNameValid && secretKeyValid;
};

export const tryFetchFromSecretsManager = async (
  secretName: string | undefined,
  secretKey: string | undefined,
  fallbackEnvvar: string,
): Promise<string> => {
  if (!secretsManagerConfigValid(secretName, secretKey)) {
    const envvar = process.env[fallbackEnvvar];
    if (!envvar) {
      throw new Error(`No value for fallback envvar ${fallbackEnvvar} for config`);
    }
    return envvar;
  }

  await tryBootstrapSecretsManager();

  const valueFromSecretsManager = get(secretsManagerConfig, <string>secretKey);
  if (!valueFromSecretsManager) {
    throw new Error(`The key ${secretKey} was not found in the ASM config`);
  }
  return valueFromSecretsManager;
};
