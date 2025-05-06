import { BaileysClass } from '../lib/baileys.js';
import { getSerialNumberByTag, getWifiPassword } from './lib/genieacs';

const bot = new BaileysClass({});

bot.on('qr', (qr: string) => console.log("QR CODE:", qr));
bot.on('ready', () => console.log("BOT READY"));
bot.on('auth_failure', (err: any) => console.log("AUTH ERROR:", err));

bot.on('message', async (message: { from: string; body: string }) => {
    const phone = message.from.split('@')[0];
    const command = message.body.toLowerCase().trim();

    if (command === 'cek sn') {
        const sn = await getSerialNumberByTag(phone);
        if (sn) {
            await bot.sendText(message.from, `✅ Serial Number Anda:`);
            await bot.sendText(message.from, `${sn}`);
        } else {
            await bot.sendText(message.from, `❌ Tidak ditemukan SN untuk nomor ini: ${phone}`);
        }
        return;
    }

    if (command === 'cek wifi') {
        const sn = await getSerialNumberByTag(phone);
        if (!sn) {
            await bot.sendText(message.from, `❌ Tidak ditemukan SN untuk nomor ini: ${phone}`);
            return;
        }

        const password = await getWifiPassword(sn);
        if (password) {
            await bot.sendText(message.from, `🔐 Password WiFi Anda saat ini: *${password}*`);
        } else {
            await bot.sendText(message.from, `❌ Gagal mengambil password WiFi untuk SN: ${sn}`);
        }
        return;
    }

    // Jika command tidak dikenal
    await bot.sendText(message.from, `❓ Perintah tidak dikenali.\nKetik *cek sn* atau *cek wifi*.`);
});
