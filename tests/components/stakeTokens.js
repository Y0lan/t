const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, BN } = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getMint } = require('@solana/spl-token');
const { fetchStakingAccounts, fetchVaultData } = require('../utils/helpers');
const { programId, myAnchorProvider, vaultId } = require('../utils/config');
const idl = require('../utils/spl-vault-idl.json');

async function TokensStaking (provider, vault, connection, inputAmount) {
    const lockupOption = 4; 
    const owner = provider.wallet.publicKey;
    const program = new Program(idl, programId, provider);
    const vaultData = await fetchVaultData(vault, connection);
    const mintInfo = await getMint(provider.connection, new PublicKey(vaultData.AllowedToken)); 
    const decimals = Math.pow(10, Number(mintInfo.decimals));
    const amount = inputAmount * decimals;
    const tokenMintAddress = new PublicKey(vaultData.AllowedToken);
    const stakingDataList = await fetchStakingAccounts(programId, owner, vault, connection);
    const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
    const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
        [
            vault.toBuffer(), Buffer.from("vault_tokens")
        ],
        programId
    );
    const results = [];
    for (const stakingData of stakingDataList) {
        const prevAmount = stakingData.stakedAmount;
        const stakingAccountAddress = new PublicKey(stakingData.accountId);

        await program.methods.stakeTokens(new BN(amount), new BN(lockupOption))
            .accounts({
                stakingAccount: stakingAccountAddress, 
                userTokenAccount: userTokenAccount,
                vaultTokenAccount: vaultTokenAccount, 
                vault: vault,
                tokenMint: tokenMintAddress, 
                tokenProgram: TOKEN_PROGRAM_ID, 
                owner: owner,
                systemProgram: SystemProgram.programId,
            })
            .signers([]) 
            .rpc();

            results.push({
                stakingAccountAddress: stakingAccountAddress,
                prevAmount: prevAmount,
                decimals: decimals
            });
    }
    return results;
};

describe('Tokens Staking', () => {
    let provider;
    let vault;
    let connection;
    let inputAmount;
    let program;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
        connection = provider.connection;
        inputAmount = 1;
        program = new Program(idl, programId, provider);
    });

    test('should correctly stake tokens with given parameters', async () => {
        
        const stakeDataList = await TokensStaking(provider, vault, connection, inputAmount);
        for (const stakeData of stakeDataList) {
            const accountState = await program.account.stakingAccount.fetch(stakeData.stakingAccountAddress);
    
            expect(accountState).not.toBeNull();
            expect(accountState).not.toBeUndefined();
            expect(new BN((accountState.stakedAmount - stakeData.prevAmount)/stakeData.decimals)).toEqual(new BN(inputAmount));
            expect(accountState.owner).toEqual(provider.wallet.publicKey);
        }
    }, 240000);

    test('should fail when called with invalid parameters', async () => {
        await expect(TokensStaking("provider", vault, connection, 0)).rejects.toThrow();
    }, 120000);
});