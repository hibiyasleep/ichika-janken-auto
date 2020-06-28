import { getAxiosInstance } from 'konmai/lib/axios';
import login from 'konmai/lib/login';

async function doIchikaJanken() {
    const jar = await login({
        id: process.env.E_AMUSEMENT_ID!,
        pw: process.env.E_AMUSEMENT_PW!,
    });
    const axios = getAxiosInstance({
        baseURL: 'https://p.eagate.573.jp/',
        jar,
    });
    const jankenPageRes = await axios.get<string>('/game/bemani/bjm2020/janken/index.html', { responseType: 'text' });
    const jankenUrlRegex = /\/game\/bemani\/bjm2020\/janken\/exe\.html\?form_type=[0-2]&chara_id=[0-9]&token_val=[0-9a-f]{16,32}/g;
    const jankenUrls = Array.from(jankenPageRes.data.matchAll(jankenUrlRegex)).map(([url]) => url);
    if (jankenUrls.length) {
        const jankenUrl = pick(jankenUrls);
        await axios.get(jankenUrl);
        console.log('done');
        process.exit(0);
    } else {
        console.error('already done');
        process.exit(1);
    }
}

doIchikaJanken().catch(err => {
    console.error(err);
    process.exit(1);
});

function pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}
