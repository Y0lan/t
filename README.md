# SPL Token Staking Program
## Project Overview
This program is a SPL token staking program. It lets the owner create a vault containing tokens in a reward pool and allows users to deposit their own tokens to farm rewards based on the APR set by the owner.

## Functional Requirements 
### Roles 
The token staking program has the following roles:
- **Owner**: Able to create the vault and deposit the tokens to be given as rewards. Able to set the APR for users to earn. 
- **User**: Able to deposit their tokens to stake and retrieve their rewards. 

### Features 
The token staking program has the following features: 
- Create vault / Add tokens to reward stakers ( Owner )
- Set APR ( Owner )
- Set lockup duration / multipliers ( Owner )
- Deposit tokens ( User )
- Withdraw Rewards ( User )

### Use Cases 

1. The owner creates a new vault and deposits tokens to pay out as rewards.
2. The owner sets an APR to determine how much tokens the users will earn per token staked.
3. The owner configures the duration a token must be staked before it can be unstaked.
4. The owner can add an additional multiplier to a certain staking option ( e.g., If a user stakes longer, they can receive a 2x multiplier on their rewards ).
5. The user can deposit and withdraw tokens while increasing their positing due to the staking interest.

## Technical Requirements 

This project has been developed using the **Rust** language together with the **Anchor** library. To write tests **javascript** is used.

In the project folder the following structure is found:
```
.
└── solana-staking-program/
    ├── programs/
    │   └── staking/
    │       ├── src/
    │       │   ├── instructions/
    │       │   │   ├── add_instant_rewards.rs
    │       │   │   ├── add_rewards.rs
    │       │   │   ├── add_timed_rewards.rs
    │       │   │   ├── initialize_account.rs
    │       │   │   ├── initialize_vault.rs
    │       │   │   ├── mod.rs
    │       │   │   ├── stake_tokens.rs
    │       │   │   ├── store_rewards.rs
    │       │   │   ├── update_vault_settings.rs
    │       │   │   ├── withdraw_rewards.rs
    │       │   │   ├── withdraw_timed_rewards.rs
    │       │   │   └── withdraw_tokens.rs
    │       │   ├── constants.rs
    │       │   ├── errors.rs
    │       │   ├── lib.rs
    │       │   ├── state.rs
    │       │   └── utils.rs
    │       └── Cargo.toml
    ├── tests/
    │   ├── components/
    │   │   ├── addRewards.js
    │   │   ├── createTimeRewards.js
    │   │   ├── initAccount.js
    │   │   ├── initVault.js
    │   │   ├── stakeTokens.js
    │   │   ├── storeRewards.js
    │   │   ├── updateVault.js
    │   │   ├── viewData.js
    │   │   └── withdrawRewards.js
    │   └── utils/
    │       ├── config.js
    │       ├── helpers.js
    │       └── spl-vault-idl.json
    ├── Anchor.toml
    ├── setup.js
    ├── Cargo.lock
    ├── Cargo.toml
    └── jest.config.js
```

In the **./programs** folder, the program is found. The program is built via ```anchor build``` and then deployed to the cluster with ```anchor deploy```. Configuration must be done in the ```Anchor.toml``` file; the desired cluster to use for deployment must be specified ( mainnet, devnet, testnet, localnet), the owner of the program's keypair and the program ID. The file ```constants.rs``` contains important constant values, which must be configured before the initial build and deploy. It is important to note as well that when the program is initially built and deployed, it will return the program ID via the command line. This address must replace the placeholder address in ```lib.rs``` and ```Anchor.toml```, and then the program must be built and deployed again. 

In the **./tests** folder, tests are found. Tests can be run using ```anchor run {name of the test}```. The various test names and functions can be found inside the ```Anchor.toml``` file. If any changes are made to the structs within the program it is important to update the `./spl-vault-idl.json` file with the new idl created in the `./target/idl` folder ( only created after build/deploy ) in order for the tests to work as expected.

## Architecture Overview

![ProgramArchitecture](misc/staking_architecture.svg)

### Contract information
#### Creating and Configuring a Vault
1. The program is first deployed using the `initialize_vault()` function, which will create the `Vault` struct, which stores all configrations of the vault. The owner specifies the SPL token that will be allowed for the vault and the staking options. There are four staking options, each with its own lockup duration and corresponding multiplier. The authority of the program is set to the keypair used to build and deploy it.

2. After the vault is initialized, the owner can set the rewards schedule (APR) using the `add_timed_rewards()` function, this updates the `TimedRewards` struct within the `Vault` struct. This function allows the owner to add a reward schedule to the vault. 

3. The owner can also transfer tokens to the account from which the stakers will be paid out using the `add_rewards()` function. This function transfers the specified amount of tokens from the owner's token account to the vault's token account.

4. The owner can update the configuration of their program at any time using the `update_vault_settings()` function. This function allows the owner to update the allowed token, staking options, and rewards schedule of the vault.

#### Staking Account
5. A user can create a staking account for a vault using the `initialize_account()` function. This function initializes a new staking account with the user as the owner of that account.

6. The user can then select from the four staking options and stake their tokens using the `stake_tokens()` function. This function transfers the specified amount of tokens from the user's token account to the staking account. The tokens are locked up and cannot be withdrawn until the lockup duration has ended.

7. After the lockup duration has ended, the user can unstake their tokens using the `withdraw_tokens()` function. This function transfers the tokens from the staking account back to the user's personal account.

8. The user must use the `store_rewards()` function to store their rewards on their account. This function updates the staking account to reflect the amount of rewards the user has earned. The actual tokens are not transferred to the staking account; only the owed value is updated.

9. To withdraw the stored rewards, the user can use the `withdraw_rewards()` function. This function transfers the stored rewards from the vault's token account to the user's personal account.

### Assets

The program contains the following structs:

- Struct `StakingAccount`: Represents a user's staking account in the system.
    - `Pubkey` owner - The public key of the owner of the staking account.
    - `Pubkey` vault - The public key of the vault associated with this staking account.
    - `u64` staked_amount - The amount of tokens staked in this account.
    - `i64` unlock_timestamp - The timestamp when the staked tokens will be unlocked.
    - `u8` lockup_option - The chosen lockup option for the staked tokens.
    - `i64` timestamp - The timestamp when the staking account was created or last updated.
    - `Vec<Reward>` rewards - A vector of Reward structs representing the rewards earned by this staking account.

- Struct Reward: Represents a reward in the system.
    - `Pubkey` reward_token_mint - The public key of the mint of the reward token.
    - `u64` amount - The amount of the reward.

- Struct `Vault`: Represents a vault in the system.
    - `Pubkey` vault_owner - The public key of the owner of the vault.
    - `Pubkey` allowed_token - The public key of the token allowed in this vault.
    - `Pubkey` vault_token_account - The public key of the token account of the vault.
    - `i64` lockup_duration_option1 - The first lockup duration option for the vault.
    - `i64` lockup_duration_option2 - The second lockup duration option for the vault.
    - `i64` lockup_duration_option3 - The third lockup duration option for the vault.
    - `i64` lockup_duration_option4 - The fourth lockup duration option for the vault.
    - `i64` lockup_multiplier_option1 - The first lockup multiplier option for the vault.
    - `i64` lockup_multiplier_option2 - The second lockup multiplier option for the vault.
    - `i64` lockup_multiplier_option3 - The third lockup multiplier option for the vault.
    - `i64` lockup_multiplier_option4 - The fourth lockup multiplier option for the vault.
    - `Pubkey` vault_ref - A reference to the vault, possibly used for indexing or identification.
    - `Vec<TimedReward>` rewards - A vector of `TimedReward` structs representing the timed rewards associated with this vault.

- Struct `TimedReward`: Represents a timed reward in the system.
    - `Pubkey` reward_token_mint - The public key of the mint of the reward token.
    - `u64` schedule - The schedule of the reward, possibly indicating when it will be distributed.
    - `i64` timestamp - The timestamp when the timed reward was created or last updated.

#### InitializeVault Function

This function is used to initialize a vault on the program. It sets up the necessary accounts and permissions for the vault.

##### Associated Struct: `InitializeVault`
- Represents the accounts needed to initialize a vault in the system.
    - `Account<'info, Vault>` vault - The vault account to be initialized.
    - `AccountInfo<'info>` vault_ref - An account that provides a unique reference for each vault. It's used for creating a seed for the vault account.
    - `Account<'info, TokenAccount>` vault_token_account - The token account of the vault, which will be initialized with the vault as the authority and the allowed token as the mint.
    - `Account<'info, Mint>` allowed_token - The mint of the token that will be allowed in the vault.
    - `Program<'info, Token>` token_program - The SPL Token program, which provides the functionality for creating and managing SPL tokens.
    - `Signer<'info>` owner - The signer of the transaction, who will be the owner of the vault.
    - `Program<'info, System>` system_program - The Solana System program, which provides the functionality for creating and managing Solana accounts.

#### UpdateVaultSettings Function

This function is used to update the settings of a vault in the system. It allows the owner of the vault to change its parameters.

##### Associated Struct: `UpdateVaultSettings`
- Struct `UpdateVaultSettings`: Represents the accounts needed to update the settings of a vault in the system.
    - `Account<'info, Vault>` vault - The vault account to be updated. The account must be owned by the `vault_owner`.
    - `Signer<'info>` vault_owner - The signer of the transaction, who must be the owner of the vault.
    - `Program<'info, System>` system_program - The Solana System program, which provides the functionality for creating and managing Solana accounts.

#### AddRewards Function

This function is used to add rewards to a vault in the system. It transfers tokens from a specified token account to the vault's reward token account.

##### Associated Struct: `AddRewards`
- Struct `AddRewards`: Represents the accounts needed to add rewards to a vault in the system.
    - `Account<'info, Vault>` vault - The vault account to which rewards will be added. The account must be owned by the `vault_owner`.
    - `Account<'info, TokenAccount>` reward_token_account - The token account from which the rewards will be transferred.
    - `Account<'info, TokenAccount>` vault_reward_token_account - The token account of the vault, which will be credited with the rewards. The account will be initialized if needed (`init_if_needed`), with the vault as the authority and the reward token mint as the mint.
    - `Account<'info, Mint>` reward_token_mint - The mint of the reward token.
    - `Program<'info, Token>` token_program - The SPL Token program, which provides the functionality for creating and managing SPL tokens.
    - `Signer<'info>` vault_owner - The signer of the transaction, who must be the owner of the vault.
    - `Program<'info, System>` system_program - The Solana System program, which provides the functionality for creating and managing Solana accounts.

#### AddTimedRewards Function

This function is used to add timed rewards to a vault in the system. It allows the owner of the vault to specify a time period during which the rewards will be distributed.

##### Associated Struct: `AddTimedRewards`
- Struct `AddTimedRewards`: Represents the accounts needed to add timed rewards to a vault in the system.
    - `Account<'info, Vault>` vault - The vault account to which timed rewards will be added. The account must be owned by the `vault_owner`.
    - `Account<'info, Mint>` reward_token_mint - The mint of the reward token.
    - `Signer<'info>` vault_owner - The signer of the transaction, who must be the owner of the vault.
    - `Program<'info, System>` system_program - The Solana System program, which provides the functionality for creating and managing Solana accounts.

#### InitializeAccount Function

This function is used to initialize a staking account in the system. It sets up the necessary accounts and permissions for the staking account.

##### Associated Struct: `InitializeAccount`
- Struct `InitializeAccount`: Represents the accounts needed to initialize a staking account in the system.
    - `Account<'info, StakingAccount>` staking_account - The staking account to be initialized. The account's space will be set to 332 bytes (`space = 332`).
    - `Signer<'info>` owner - The signer of the transaction, who will be the owner of the staking account.
    - `Account<'info, Vault>` vault - The vault associated with the staking account.
    - `Program<'info, System>` system_program - The Solana System program, which provides the functionality for creating and managing Solana accounts.

#### StakeTokens Function

This function is used to stake tokens in the system. It debits tokens from the user's token account and credits them to the vault's token account.

##### Associated Struct: `StakeTokens`
- Struct `StakeTokens`: Represents the accounts needed to stake tokens in the system.
    - `Account<'info, StakingAccount>` staking_account - The staking account of the user, which must be owned by the signer.
    - `Account<'info, TokenAccount>` user_token_account - The token account of the user, which will be debited when staking tokens.
    - `Account<'info, TokenAccount>` vault_token_account - The token account of the vault, which will be credited when staking tokens.
    - `Account<'info, Vault>` vault - The vault where the tokens will be staked.
    - `Account<'info, Mint>` token_mint - The mint of the token being staked.
    - `Program<'info, Token>` token_program - The SPL Token program.
    - `Signer<'info>` owner - The signer of the transaction, who must be the owner of the staking account.
    - `Program<'info, System>` system_program - The Solana System program.

#### StoreRewards Function

This function is used to store rewards in a staking account in the system. It credits the staking account with the rewards.

##### Associated Struct: `StoreRewards`
- Struct `StoreRewards`: Represents the accounts needed to store rewards in a staking account in the system.
    - `Account<'info, StakingAccount>` staking_account - The staking account where rewards will be stored. The account must be owned by the `owner` and is mutable (`mut`).
    - `Account<'info, Vault>` vault - The vault associated with the staking account.
    - `Account<'info, Mint>` staking_mint - The mint of the staking token.
    - `Signer<'info>` owner - The signer of the transaction, who must be the owner of the staking account. The account is mutable (`mut`).

#### WithdrawTokens Function

This function is used to withdraw tokens from a staking account in the system. It debits tokens from the staking account and credits them to the user's token account.

##### Associated Struct: `WithdrawTokens`
- Struct `WithdrawTokens`: Represents the accounts needed to withdraw tokens from a staking account in the system.
    - `Account<'info, StakingAccount>` staking_account - The staking account from which tokens will be withdrawn. The account must be owned by the `owner` and is mutable (`mut`).
    - `Account<'info, TokenAccount>` user_token_account - The token account of the user, which will be credited when withdrawing tokens. The account is mutable (`mut`).
    - `Account<'info, TokenAccount>` vault_token_account - The token account of the vault, which will be debited when withdrawing tokens. The account is mutable (`mut`).
    - `Account<'info, Vault>` vault - The vault associated with the staking account. The account is mutable (`mut`).
    - `Account<'info, Mint>` token_mint - The mint of the token being withdrawn. The account is mutable (`mut`).
    - `Program<'info, Token>` token_program - The SPL Token program.
    - `Signer<'info>` owner - The signer of the transaction, who must be the owner of the staking account. The account is mutable (`mut`).
    - `Program<'info, System>` system_program - The Solana System program.

#### WithdrawRewards Function

This function is used to withdraw rewards from a staking account in the system. It debits rewards from the staking account and credits them to the user's token account.

##### Associated Struct: `WithdrawRewards`
- Struct `WithdrawRewards`: Represents the accounts needed to withdraw rewards from a staking account in the system.
    - `Account<'info, StakingAccount>` staking_account - The staking account from which rewards will be withdrawn. The account must be owned by the `owner` and is mutable (`mut`).
    - `Account<'info, TokenAccount>` user_token_account - The token account of the user, which will be credited when withdrawing rewards. The account is mutable (`mut`).
    - `Account<'info, TokenAccount>` vault_token_account - The token account of the vault, which will be debited when withdrawing rewards. The account is mutable (`mut`).
    - `Account<'info, Vault>` vault - The vault associated with the staking account. The account is mutable (`mut`).
    - `Account<'info, Mint>` token_mint - The mint of the token being withdrawn. The account is mutable (`mut`).
    - `Program<'info, Token>` token_program - The SPL Token program.
    - `Signer<'info>` owner - The signer of the transaction, who must be the owner of the staking account. The account is mutable (`mut`).
    - `Program<'info, System>` system_program - The Solana System program.

#### CalculateAndUpdateRewards Function

This function will calculate the deserved reward for the user based on the associated timestamp and update the `rewards` struct within their staking account.

#### Constants
- `u64` SECONDS_IN_YEAR: Represents the number of seconds in a year, which is used for calculating rewards per second.

- `u64` REWARD_SCALE_FACTOR: A scale factor used for reward calculations to maintain precision.

- `str` TOKEN_ADDRESS: The address of the token used for staking in the system.

- `str` OWNER_ADDRESS: The address of the owner of the staking program.
