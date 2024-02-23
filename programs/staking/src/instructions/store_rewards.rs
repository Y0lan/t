use crate::errors::VaultError;
use crate::state::*;
use crate::utils::calculate_and_update_rewards;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;


#[derive(Accounts)]
pub struct StoreRewards<'info> {
    #[account(mut, has_one = owner)]
    pub staking_account: Account<'info, StakingAccount>,
    pub vault: Account<'info, Vault>,
    pub staking_mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn store_rewards(ctx: Context<StoreRewards>) -> Result<()> {
    let clock = Clock::get()?;
    let staking_account = &mut ctx.accounts.staking_account;
    let vault = &ctx.accounts.vault;
    let staking_decimals = ctx.accounts.staking_mint.decimals as u32;
    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );

    calculate_and_update_rewards(staking_account, vault, &clock, staking_decimals)?;
    
    staking_account.timestamp = clock.unix_timestamp;
    

    Ok(())
}
