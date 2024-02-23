const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, BN } = require('@project-serum/anchor');
const { fetchVaultData } = require('../utils/helpers');
const { programId, myAnchorProvider, vaultId, splTokenAddress } = require('../utils/config');
const idl = require('../utils/spl-vault-idl.json');


async function UpdateVault (provider, vault, newAllowedToken, bnLockupDurations, bnLockupMultipliers, selectedRewardIndex, rewardUpdateTokenId, rewardUpdateAmount)  {
    const program = new Program(idl, programId, provider);
    await program.methods.updateVaultSettings(
        new PublicKey(newAllowedToken),
        bnLockupDurations,
        bnLockupMultipliers,
        selectedRewardIndex,
        new PublicKey(rewardUpdateTokenId),
        new BN(rewardUpdateAmount) 
    )
    .accounts({
        vault: vault,
        vaultOwner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
    })
    .rpc();
};

describe('Update Vault', () => {
    let provider;
    let vault;
    let connection;

    beforeAll(async () => {
        provider = myAnchorProvider;
        vault = vaultId;
        connection = provider.connection;
    });

    test('should correctly update vault settings with given parameters', async () => {
        const newAllowedToken = splTokenAddress;
        const bnLockupDurations = Array.from({ length: 4 }, () => new BN(Math.floor(Math.random() * 100000)));
        const bnLockupMultipliers = Array.from({ length: 4 }, () => new BN(Math.floor(Math.random() * 1000)));
        const selectedRewardIndex =  0;
        const rewardUpdateTokenId = splTokenAddress;
        const rewardUpdateAmount =  0.05 * 10e9; //apr (0-1) multiplied by 10^9, eg. this is 5% apr

        await UpdateVault(provider, vault, newAllowedToken, bnLockupDurations, bnLockupMultipliers, selectedRewardIndex, rewardUpdateTokenId, rewardUpdateAmount);

        const vaultData = await fetchVaultData(vault, connection);
        console.log("Vault data:", vaultData);
        expect(vaultData.AllowedToken).toEqual(newAllowedToken);
        for (let i = 0; i < 4; i++) {
            expect(new BN(vaultData[`lockupDuration${i+1}`])).toEqual(bnLockupDurations[i]);
            expect(new BN(vaultData[`lockupMultiplier${i+1}`])).toEqual(bnLockupMultipliers[i]);
        }        
        expect(vaultData.rewards[selectedRewardIndex].rewardTokenMint).toEqual(rewardUpdateTokenId);
        expect(new BN(vaultData.rewards[selectedRewardIndex].schedule)).toEqual(new BN(rewardUpdateAmount));
    },  30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(UpdateVault("provider", vault, connection)).rejects.toThrow();
    },  30000);
});
  