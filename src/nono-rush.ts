import * as querystring from 'querystring';

import { getAxiosInstance } from 'konmai/lib/axios';
import login from 'konmai/lib/login';

import { pick, retryUntilSuccess } from './misc';

async function doNonoRush() {
    const jar = await retryUntilSuccess(() => login({
        id: process.env.E_AMUSEMENT_ID!,
        pw: process.env.E_AMUSEMENT_PW!,
    }));
    const axios = getAxiosInstance({
        baseURL: 'https://p.eagate.573.jp/',
        jar,
    });
    const rushPageRes = await axios.get<string>('/game/bemani/wbr2020/01/card.html', { responseType: 'text' });
    const tokenRegex = /<input id="id_initial_token" type="hidden" value="([0-9a-f]{20,32})">/g;
    const tokens = Array.from(rushPageRes.data.matchAll(tokenRegex)).map(([, token]) => token);
    if (tokens.length !== 1) {
        console.error('something wrong');
        process.exit(1);
    }
    await axios.post(
        '/game/bemani/wbr2020/01/card_save.html',
        querystring.stringify({
            c_type: 0,
            c_id: pick(['0', '1', '2']),
            t_id: tokens[0],
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
    );
    console.log('done');
    process.exit(0);
}

doNonoRush().catch(err => {
    console.error(err);
    process.exit(1);
});
