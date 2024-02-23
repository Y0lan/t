const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, BN } = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require('@solana/spl-token');
const { fetchStakingAccounts} = require('../utils/helpers');
const { programId, vaultId, connection, myAnchorProvider } = require('../utils/config');
const idl = require('../utils/spl-vault-idl.json');

async function WithdrawRewards (provider, vault, connection, stakingAccountIndex) {
    let stakingData = null;
    let selectedReward = null;
    let stakingAccount = 0;
    
    const fetchData = async () => {
        const owner = provider.wallet.publicKey;
        stakingData = await fetchStakingAccounts(programId, owner, vault, connection);
        stakingAccount = stakingData[stakingAccountIndex];
        selectedReward = stakingAccount.rewards[0];
    };

    await fetchData();

    const program = new Program(idl, programId, provider);
    const tokenMintAddress = new PublicKey(selectedReward.rewardTokenMint)
    const stakingAccountAddress = new PublicKey(stakingAccount.accountId)
    const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
    let instructions = []
    if (userTokenAccount === null) {
        instructions.push(
            createAssociatedTokenAccountInstruction(provider.wallet.publicKey, userTokenAccount, provider.wallet.publicKey, tokenMintAddress)
        )
    }
            const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
                [
                    Buffer.from("spl_rewards"), vault.toBuffer(), tokenMintAddress.toBuffer()
                ],
                programId
            );
    const rewardAmount = new BN(selectedReward.amount)
    await program.methods.withdrawRewards()
    .accounts({
        stakingAccount: stakingAccountAddress, 
        userTokenAccount: userTokenAccount,
        vaultTokenAccount: vaultTokenAccount, 
        vault: vault,
        tokenMint: tokenMintAddress, 
        tokenProgram: TOKEN_PROGRAM_ID, 
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
    })
    .preInstructions([...instructions])
    .signers([]) 
    .rpc();
    await sleep(3000);
    return rewardAmount;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Withdraw Rewards', () => {
    let provider;
    let vault;
    let program;
    let stakingAccountIndex;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
        program = new Program(idl, programId, provider);
        stakingAccountIndex =  2; // Replace with the index of the staking account you want to withdraw rewards from
    });

    test('should correctly withdraw rewards with given parameters', async () => {
        const stakingData = await fetchStakingAccounts(programId, provider.wallet.publicKey, vault, provider.connection);
        const stakingAccount = stakingData[stakingAccountIndex];
        const selectedReward = stakingAccount.rewards[0];
        if (selectedReward === undefined) {
            throw new Error("No rewards to withdraw");
        }
        
        const tokenMintAddress = new PublicKey(selectedReward.rewardTokenMint);
        const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
        const beforeUserTokenAccountBalance = await connection.getTokenAccountBalance(userTokenAccount);
        rewardAmount = await WithdrawRewards(provider, vault, provider.connection, stakingAccountIndex);
        const afterUserTokenAccountBalance = await connection.getTokenAccountBalance(userTokenAccount);
        const diff = new BN(afterUserTokenAccountBalance.value.amount).sub(new BN(beforeUserTokenAccountBalance.value.amount));
        expect(stakingAccount).not.toBeNull();
        expect(selectedReward).not.toBeNull();
        expect(diff.eq(rewardAmount)).toBe(true);
    },   30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(WithdrawRewards("provider", vault, provider.connection, stakingAccountIndex)).rejects.toThrow();
    },   30000);
});
