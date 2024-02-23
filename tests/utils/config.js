const {PublicKey, Keypair, Connection} = require("@solana/web3.js");
const { AnchorProvider, Wallet } = require('@project-serum/anchor');
const fs = require("fs");

//Change to setup for tests
const rpcEndpoint = "https://api.devnet.solana.com"; //RPC endpoint
const keypairPath = "/Users/enzomarioaiello/.config/solana/id4.json"; //path to keypair json file
const splTokenAddress = "4pPsToYWtU4UFBtpoeWCgNXSgz1B3h3qEGZUtmACuqcn" // Address of the SPL Token for the vault created on chain
const programId = new PublicKey("1cBTAQ7XtS2MuhGanUh66rMWs92YWm1z2xBoERGj6gh"); // Program ID of the SPL staking program
const vaultId = new PublicKey("DNR1smykyW6Zn1qjH9zf2Agqv15K4Tvj4mMw6izQqCdZ"); // Vault ID of the vault created on chain

//Config for tests
const SECONDS_IN_YEAR = 31536000;
const connection = new Connection(rpcEndpoint);
const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))));
const anchorWallet = new Wallet(keypair);
const myAnchorProvider = new AnchorProvider(connection, anchorWallet, {})

module.exports = {
    SECONDS_IN_YEAR,
    programId,
    splTokenAddress,
    vaultId,
    keypair,
    myAnchorProvider,
    connection
};