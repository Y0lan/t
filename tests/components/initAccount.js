const { SystemProgram } = require('@solana/web3.js');
const { Program, web3 } = require('@project-serum/anchor');
const { programId, myAnchorProvider, vaultId } = require('../utils/config');
const idl = require('../utils/spl-vault-idl.json');

async function initializeAccount(provider, vaultPublicKey) {
    const program = new Program(idl, programId, provider);
    const stakingAccount = web3.Keypair.generate();
        data = await program.methods.initializeAccount(vaultPublicKey)
            .accounts({
                stakingAccount: stakingAccount.publicKey,
                owner: provider.wallet.publicKey,
                vault: vaultPublicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([stakingAccount])
            .rpc();
    return stakingAccount.publicKey;
}

describe('Initialize Account', () => {
    let provider;
    let vault;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
    });

    test('should correctly initialize an account with given parameters', async () => {
        const program = new Program(idl, programId, provider);
        const stakingAccount = await initializeAccount(provider, vault);
        const accountState = await program.account.stakingAccount.fetch(stakingAccount);

        expect(accountState).not.toBeNull();
        expect(accountState).not.toBeUndefined();
        expect(accountState.owner).toEqual(provider.wallet.publicKey);
        expect(accountState.vault).toEqual(vault);
    },  30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(initializeAccount("provider", vault)).rejects.toThrow();
    },  30000);
});
