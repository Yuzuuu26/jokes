import * as net from 'net';
import * as readline from 'readline';
import dotenv from 'dotenv';
dotenv.config();
const PORT = Number(process.env.PORT);
const IP = process.env.IP_ADDRESS;
const client = net.createConnection(PORT, IP, () => {
    console.log('Connected to server');
    client.write('Hello! (from client)\n');
});
client.on('data', (data) => {
    client.write(data);
});
client.on('end', () => {
    console.log('Connection ended');
});
client.on('close', () => {
    console.log('Connection closed');
});
client.on('error', (err) => {
    console.log('Error:', err.message);
});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', (input) => {
    client.write(input.trim());
});
//# sourceMappingURL=client.js.map