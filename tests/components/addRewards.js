const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, BN } = require('@project-serum/anchor');
const idl = require('../utils/spl-vault-idl.json');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getMint } = require('@solana/spl-token');
const { programId, vaultId, myAnchorProvider, splTokenAddress, connection } = require('../utils/config');

async function DepositRewards(provider, vault, amount, tokenMint) {
    const program = new Program(idl, programId, provider);
    const tokenMintAddress = new PublicKey(tokenMint);
    const owner = provider.wallet.publicKey;
    const mintInfo = await getMint(provider.connection, new PublicKey(tokenMint));
    const decimals = mintInfo.decimals;
    const decimalsAmount = amount*Math.pow(10, decimals)

    const rewardTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);

    const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
        [
            Buffer.from("spl_rewards"), vault.toBuffer(), tokenMintAddress.toBuffer()
        ],
        programId
    );
    vaultRewardTokenAccountBalance = await connection.getTokenAccountBalance(vaultTokenAccount);
    data = await program.methods.addRewards(new BN(decimalsAmount))
        .accounts({
            vault: vault,
            rewardTokenAccount: rewardTokenAccount,
            vaultRewardTokenAccount: vaultTokenAccount,
            rewardTokenMint: tokenMintAddress,
            tokenProgram: TOKEN_PROGRAM_ID,
            owner: owner,
            systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();
    return {
        vaultTokenAccount: vaultTokenAccount,
        balance: vaultRewardTokenAccountBalance.value.uiAmount
    };
};

describe('Deposit Rewards', () => {
    let provider;
    let vault;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
    });

    test('should correctly deposit rewards with given parameters', async () => {
        const tokenMint = splTokenAddress;
        const amount =  10;

        vaultTokenAccount = await DepositRewards(provider, vault, amount, tokenMint);
        const newVaultRewardTokenAccountBalance = await connection.getTokenAccountBalance(vaultTokenAccount.vaultTokenAccount);

        expect(newVaultRewardTokenAccountBalance.value.uiAmount - vaultTokenAccount.balance).toEqual(amount);
    },   30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(DepositRewards("provider", vault)).rejects.toThrow();
    },   30000);
});
