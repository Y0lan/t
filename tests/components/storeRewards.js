const {  PublicKey } = require('@solana/web3.js');
const { Program } = require('@project-serum/anchor');
const idl = require('../utils/spl-vault-idl.json');
const { fetchStakingAccounts, fetchVaultData } = require('../utils/helpers');
const { programId, myAnchorProvider, vaultId, connection } = require('../utils/config');

async function StoreRewards(provider, vault, connection, stakingAccountIndex) {
    let stakingDataList = null;
    let stakingAccount = null;
    let vaultData = null;

    const fetchData = async () => {
        const owner = provider.wallet.publicKey
        vaultData = await fetchVaultData(vault, connection);
        stakingDataList = await fetchStakingAccounts(programId, owner, vault, connection);
        stakingAccount = stakingDataList[stakingAccountIndex];
    };
    
    await fetchData();

    if (stakingAccount !== null) {
        const timestampMilliseconds = stakingAccount.timestamp * 1000;
        const currentTimeMilliseconds = Date.now();
        const oneMinutesInMilliseconds = 1 * 60 * 1000; 
        const timeDifference = currentTimeMilliseconds - timestampMilliseconds;
        if (timeDifference >= oneMinutesInMilliseconds) {
            const program = new Program(idl, programId, provider);
            await program.methods.storeRewards()
            .accounts({
                stakingAccount: new PublicKey(stakingAccount.accountId),
                vault: vault,
                stakingMint: new PublicKey(vaultData.AllowedToken),
                owner: provider.wallet.publicKey,
            })
            .rpc();
        } else {
        throw new Error("Wait for cooldown");
        }
    }
};

describe('Store Rewards', () => {
    let provider;
    let vault;
    let program;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
        program = new Program(idl, programId, provider);
    });

    test('should correctly store rewards with given parameters', async () => {
        const stakingAccountIndex = 0; // Index of the staking account to store rewards for
        const owner = provider.wallet.publicKey

        await StoreRewards(provider, vault, provider.connection, stakingAccountIndex);
        stakingDataList = await fetchStakingAccounts(programId, owner, vault, connection);
        stakingAccount = stakingDataList[stakingAccountIndex];
        expect(stakingAccount).not.toBeNull();
    },   30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(StoreRewards("provider", vault, provider.connection)).rejects.toThrow();
    },   30000);
});

