#!/usr/bin/env node
const { spawn } = require('child_process');
const { networkInterfaces } = require('os');

// Get first non-internal IPv4 address
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
console.log(`On Your Network: http://${ip}:8000`);

const command = `npx next dev --hostname 0.0.0.0 --turbopack -p 8000`;
const child = spawn(command, {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => process.exit(code));
