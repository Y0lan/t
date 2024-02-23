const { Connection, PublicKey, SystemProgram, Keypair } = require('@solana/web3.js');
const { Wallet, Program, BN, AnchorProvider } = require('@project-serum/anchor');
const { getMint } = require('@solana/spl-token');
const { fetchStakingAccounts, fetchVaultData, countdownToUnlock } = require('../utils/helpers');
const { programId, myAnchorProvider, vaultId, connection } = require('../utils/config');


//Run file in order to see some data on the vault and its accounts
function view () {
    viewData(myAnchorProvider, vaultId, connection);
  }
  
  view();

async function viewData (provider, vault, connection) {
    let decimals = 10;
    let stakingData = 1;
    let stakingDataList = [];
    let lockupOption = 4; 
    let vaultData = 1;

    const fetchData = async () => {
        const owner = provider.wallet.publicKey
        vaultData = await fetchVaultData(vault, connection);
        console.log("Vault data:", vaultData);
        mintInfo = await getMint(provider.connection, new PublicKey(vaultData.AllowedToken)); 
        decimals = Math.pow(10, Number(mintInfo.decimals));
        stakingDataList = await fetchStakingAccounts(programId, owner, vault, connection);
        for (const stakingData of stakingDataList) {
            amountStaked = Number(stakingData.stakedAmount)/decimals;
            console.log("Staking amount:", stakingData);
        }

    };
    await fetchData();
};