use crate::errors::*;
use crate::state::*;
use crate::constants::*;
use anchor_lang::prelude::*;
use std::str::FromStr;
use anchor_spl::token::{Mint, TokenAccount, Token};

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        seeds = [b"spl_vault".as_ref(), vault_ref.key().as_ref()],
        bump,
        space = 444
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: The `vault_ref` is simply generated for a unique Ref for each vault.
    /// It is safe because it is only for creating a seed.
    pub vault_ref: AccountInfo<'info>,
    #[account(
        init,
        seeds = [vault.key().as_ref(), b"vault_tokens"],
        bump,
        payer = owner,
        token::mint = allowed_token,
        token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    pub allowed_token: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_vault(
    ctx: Context<InitializeVault>,
    allowed_token: Pubkey,
    lockup_duration_options: [i64; 4],
    lockup_multiplier_options: [i64; 4],
) -> Result<()> {
    let owner_pubkey = Pubkey::from_str(OWNER_ADDRESS).unwrap();

    require!(
        ctx.accounts.owner.key == &owner_pubkey,
        VaultError::Unauthorized
    );

    require!(
        allowed_token != Pubkey::default(),
        VaultError::AlreadyInitialized
    );
    require!(
        lockup_duration_options[0] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        lockup_duration_options[1] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        lockup_duration_options[2] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        lockup_duration_options[3] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        lockup_multiplier_options[0] > 0,
        VaultError::InvalidLockupMultiplier
    );
    require!(
        lockup_multiplier_options[1] > 0,
        VaultError::InvalidLockupMultiplier
    );
    require!(
        lockup_multiplier_options[2] > 0,
        VaultError::InvalidLockupMultiplier
    );
    require!(
        lockup_multiplier_options[3] > 0,
        VaultError::InvalidLockupMultiplier
    );

    let vault = &mut ctx.accounts.vault;
    let vault_ref = &mut ctx.accounts.vault_ref;
    vault.vault_owner = *ctx.accounts.owner.key;
    vault.allowed_token = allowed_token;
    vault.vault_token_account = ctx.accounts.vault_token_account.key();
    vault.lockup_duration_option1 = lockup_duration_options[0];
    vault.lockup_duration_option2 = lockup_duration_options[1];
    vault.lockup_duration_option3 = lockup_duration_options[2];
    vault.lockup_duration_option4 = lockup_duration_options[3];
    vault.lockup_multiplier_option1 = lockup_multiplier_options[0];
    vault.lockup_multiplier_option2 = lockup_multiplier_options[1];
    vault.lockup_multiplier_option3 = lockup_multiplier_options[2];
    vault.lockup_multiplier_option4 = lockup_multiplier_options[3];
    vault.vault_ref = vault_ref.key();

    msg!("Vault Initialized");
    msg!("Vault ID: {}", vault.key());

    Ok(())
}