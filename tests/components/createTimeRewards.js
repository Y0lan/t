const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, BN } = require('@project-serum/anchor');
const { fetchVaultData } = require('../utils/helpers');
const idl = require('../utils/spl-vault-idl.json');
const { getMint } = require('@solana/spl-token');
const { programId, vaultId, splTokenAddress, myAnchorProvider } = require('../utils/config');

async function CreateTimedRewards ( provider, vault, schedule ) {
    const tokenMint = splTokenAddress;

    const program = new Program(idl, programId, provider);
    const tokenMintAddress = new PublicKey(tokenMint);
    const mintInfo = await getMint(provider.connection, new PublicKey(tokenMintAddress));
    const rewardDecimals = mintInfo.decimals;

    await program.methods.addTimedRewards(new BN(Math.pow(10, rewardDecimals) * schedule))
        .accounts({
            vault: vault,
            rewardTokenMint: tokenMintAddress,
            vaultOwner: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();
};
describe('Create Timed Rewards', () => {
    let provider;
    let vault;
    let program;
    let schedule;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
        program = new Program(idl, programId, provider);
        schedule = 0.05; //apr (0-1), eg. this is 5% apr
    });

    test('should correctly add timed rewards with given parameters', async () => {
        const tokenMint = splTokenAddress;
        const tokenMintAddress = new PublicKey(tokenMint);
        const mintInfo = await getMint(provider.connection, new PublicKey(tokenMintAddress));
        const rewardDecimals = mintInfo.decimals;

        await CreateTimedRewards(provider, vault, schedule);

        const vaultData = await fetchVaultData(vault, provider.connection);
        const reward = vaultData.rewards[0].schedule;

        expect(reward).not.toBeNull();
        expect(new BN(reward)).toEqual(new BN(Math.pow(10, rewardDecimals) * schedule));
    },   30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(CreateTimedRewards("provider", vault, schedule)).rejects.toThrow();
    },   30000);
});