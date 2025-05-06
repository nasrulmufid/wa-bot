import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GENIEACS_API_URL = process.env.GENIEACS_API_URL!;
const GENIEACS_USERNAME = process.env.GENIEACS_USERNAME!;
const GENIEACS_PASSWORD = process.env.GENIEACS_PASSWORD!;

export async function getSerialNumberByTag(tag: string): Promise<string | null> {
    try {
        const response = await axios.get(`${GENIEACS_API_URL}/devices`, {
            auth: {
                username: GENIEACS_USERNAME,
                password: GENIEACS_PASSWORD
            },
            params: {
                query: JSON.stringify({ _tags: tag }),
                limit: 1
            }
        });

        if (response.data.length > 0) {
            return response.data[0]._id;
        }

        return null;
    } catch (error: any) {
        console.error('Error saat ambil SN:', error.message);
        return null;
    }
}

export async function getWifiPassword(sn: string): Promise<string | null> {
    try {
        const response = await axios.get(`${GENIEACS_API_URL}/devices/${sn}`, {
            auth: {
                username: GENIEACS_USERNAME,
                password: GENIEACS_PASSWORD
            }
        });

        const param = response.data['InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase'];
        if (param && param.value) {
            return param.value;
        }

        return null;
    } catch (error: any) {
        console.error('Gagal ambil password wifi:', error.message);
        return null;
    }
}
