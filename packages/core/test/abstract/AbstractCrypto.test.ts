import {
    KeyChain,
    PrivateKey,
    PublicKey,
} from '../../src/crypto';

describe('Key classes', () => {

    test('toString should return json representation', () => {
        const privateKey = new PrivateKey('0001020304');
        const publicKey = new PublicKey();
        const keyChain = new KeyChain(privateKey, publicKey);

        console.log(keyChain, keyChain.public.toString(), keyChain.private.toString(), keyChain.toString());

		expect(keyChain +  '').toEqual(JSON.stringify({
			'public': publicKey + '',
			'private': privateKey + ''
		}));

        expect(privateKey.hex).toEqual('0001020304');

    });
});
