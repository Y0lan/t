use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(init, payer = owner, space = 332)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_account(ctx: Context<InitializeAccount>, vault: Pubkey) -> Result<()> {
    let staking_account = &mut ctx.accounts.staking_account;
    let clock = Clock::get()?;
    staking_account.timestamp = clock.unix_timestamp;
    staking_account.owner = *ctx.accounts.owner.key;
    staking_account.vault = vault;
    Ok(())
}
