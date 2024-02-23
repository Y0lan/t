use crate::errors::VaultError;
use crate::state::*;
use crate::utils::calculate_and_update_rewards;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut, has_one = owner)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64, lockup_option: u8) -> Result<()> {
    let staking_account = &mut ctx.accounts.staking_account;

    let lockup_duration = match lockup_option {
        1 => ctx.accounts.vault.lockup_duration_option1,
        2 => ctx.accounts.vault.lockup_duration_option2,
        3 => ctx.accounts.vault.lockup_duration_option3,
        4 => ctx.accounts.vault.lockup_duration_option4,
        _ => return Err(VaultError::InvalidLockupOption.into()),
    };

    require!(lockup_duration >= 0, VaultError::InvalidLockupDuration);
    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );
    require!(
        ctx.accounts.user_token_account.mint == ctx.accounts.vault.allowed_token,
        VaultError::NotAllowedToken
    );

    if staking_account.staked_amount == 0 {
        staking_account.lockup_option = lockup_option;
    } else {
        require!(
            lockup_option == staking_account.lockup_option,
            VaultError::LockupMismatch
        );
    }

    let clock = Clock::get()?;
    let unlock_timestamp = clock.unix_timestamp + lockup_duration;
    staking_account.unlock_timestamp = unlock_timestamp;
    staking_account.staked_amount += amount;
    let vault = &ctx.accounts.vault;
    let staking_decimals = ctx.accounts.token_mint.decimals as u32;
    
    calculate_and_update_rewards(
        staking_account,
        vault,
        &clock,
        staking_decimals,
    )?;

    staking_account.timestamp = clock.unix_timestamp;

    let transfer_cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    );
    token::transfer(transfer_cpi_ctx, amount)?;

    Ok(())
}
