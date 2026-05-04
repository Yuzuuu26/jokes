import * as net from 'net';
import dotenv from 'dotenv';
dotenv.config();
const PORT = Number(process.env.PORT);
const IP = process.env.IP_ADDRESS;
const client = net.createConnection(PORT, IP, () => {
    console.log('Connected to server');
    client.write('Hello! (from client)\n');
});
client.on('data', (data) => {
    let jsonID = JSON.parse(JSON.stringify({ id: data }));
    client.write(jsonID);
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
//# sourceMappingURL=client.js.map