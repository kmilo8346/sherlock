import os from 'os';
import fs from 'fs';
import path from 'path';

// Obtener el ip del computador
const networkInterfaces = os.networkInterfaces();
const ip = networkInterfaces['en0'].find(
  (network) => network.family === 'IPv4'
).address;

// Obtener el path del fichero environment
const envPath = path.join(process.cwd(), '.env');

// Cargar el fichero environment
const env = fs.readFileSync(envPath, 'utf8');

// Obtengo la variable de entorno EXPO_PUBLIC_API_URL
const apiUrl = env.match(/EXPO_PUBLIC_API_URL=(.*)/)[1];

const [protocol, rest] = apiUrl.split('//');
const [, port] = rest.split(':');

const newApiUrl = `${protocol}//${ip}:${port}`;

// Reemplazar la ip en el fichero environment
const newEnv = env.replace(apiUrl, newApiUrl);

// Guardar el fichero environment
fs.writeFileSync(envPath, newEnv);

console.log('IP actualizada en el fichero .env');
