use crate::errors::VaultError;
use crate::utils::calculate_and_update_rewards;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct WithdrawTokens<'info> {
    #[account(mut, has_one = owner)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> {
    let clock = Clock::get()?;
    let staking_account = &mut ctx.accounts.staking_account;
    let vault = &mut ctx.accounts.vault;
    let mint_decimals = ctx.accounts.token_mint.decimals as u32;
    let unlock_timestamp = staking_account.unlock_timestamp;

    require!(
        ctx.accounts.token_mint.key() == vault.allowed_token,
        VaultError::WrongToken
    );
    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );
    require!(
        staking_account.staked_amount >= amount,
        VaultError::InsufficientFunds
    );
    require!(
        clock.unix_timestamp >= unlock_timestamp,
        VaultError::LockupDurationNotMet
    );

    calculate_and_update_rewards(staking_account, vault, &clock, mint_decimals)?;

    let (_, bump_seed) = Pubkey::find_program_address(
        &[b"spl_vault", ctx.accounts.vault.vault_ref.as_ref()],
        ctx.program_id,
    );

    let seeds = &[
        &b"spl_vault".as_ref(),
        ctx.accounts.vault.vault_ref.as_ref(),
        &[bump_seed],
    ];
    let signer_seeds = &[&seeds[..]];

    let transfer_cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        },
        signer_seeds,
    );

    token::transfer(transfer_cpi_ctx, amount)?;
    staking_account.timestamp = clock.unix_timestamp;
    staking_account.staked_amount = staking_account
        .staked_amount
        .checked_sub(amount)
        .ok_or(VaultError::Overflow)?;

    Ok(())
}
