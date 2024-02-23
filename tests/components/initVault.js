const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, web3, BN  } = require('@project-serum/anchor');
const idl = require('../utils/spl-vault-idl.json');
const fs = require("fs");
const { programId, myAnchorProvider, splTokenAddress } = require('../utils/config');

async function initializeVault(
    provider, 
    allowedToken, 
    lockupDurationOptions,
    lockupMultiplierOptions
) {
    const program = new Program(idl, programId, provider);
    const vaultRef = web3.Keypair.generate();
    const vaultRefDone = vaultRef.publicKey

    const [vault, _bump] = await PublicKey.findProgramAddressSync(
        [
            Buffer.from("spl_vault"), vaultRefDone.toBuffer()
        ],
        programId
    );

    const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
        [
            vault.toBuffer(), Buffer.from("vault_tokens")
        ],
        programId
    );

    data =await program.methods.initializeVault(allowedToken, lockupDurationOptions, lockupMultiplierOptions)
    .accounts({
      vault: vault,
      vaultRef: vaultRef.publicKey.toBase58(),
      vaultTokenAccount: vaultTokenAccount,
      allowedToken: allowedToken,
      owner: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();
    const filePath = 'tests/utils/config.js';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const newVaultId = vault.toBase58();
    const newFileContent = fileContent.replace(/(const vaultId = new PublicKey\(")(.*)("\);)/, `$1${newVaultId}$3`);
    fs.writeFileSync(filePath, newFileContent);
    return vault;
}

describe('Initialize Vault', () => {
    let provider;
    let allowedToken;
    let program;
    let lockupDurationOptions;
    let lockupMultiplierOptions;

    beforeAll(async () => {
        provider = myAnchorProvider;
        allowedToken = splTokenAddress;
        lockupDurationOptions = Array.from({ length: 4 }, () => new BN(Math.floor(Math.random() * 100000)));
        lockupMultiplierOptions = Array.from({ length: 4 }, () => new BN(Math.floor(Math.random() * 1000)));
        program = new Program(idl, programId, provider);
    }, 30000);
    test('should correctly initialize vault with given parameters', async () => {
        const vault = await initializeVault(provider, new PublicKey(allowedToken), lockupDurationOptions, lockupMultiplierOptions);
        const vaultState = await program.account.vault.fetch(vault);

        expect(vaultState).not.toBeNull();
        expect(vaultState).not.toBeUndefined();

        for (let i = 0; i < 4; i++) {
            expect(vaultState[`lockupDurationOption${i+1}`]).toEqual(lockupDurationOptions[i]);
            expect(vaultState[`lockupMultiplierOption${i+1}`]).toEqual(lockupMultiplierOptions[i]);
        }

        expect(vaultState.vaultOwner).toEqual(provider.wallet.publicKey);
    }, 30000);

    test('should fail when called with invalid parameters', async () => {
        await expect(initializeVault("provider", allowedToken, new BN(1), lockupMultiplierOptions + 1)).rejects.toThrow();
    }, 30000);
});
