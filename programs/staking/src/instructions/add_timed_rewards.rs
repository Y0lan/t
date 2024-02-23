use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct AddTimedRewards<'info> {
    #[account(mut, has_one =vault_owner)]
    pub vault: Account<'info, Vault>,
    pub reward_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub vault_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn add_timed_rewards(ctx: Context<AddTimedRewards>, schedule: u64) -> Result<()> {
    let clock = Clock::get()?;
    let vault = &mut ctx.accounts.vault;
    require!(
        vault.vault_owner == ctx.accounts.vault_owner.key(),
        VaultError::Unauthorized
    );

    let reward_token_mint_key = ctx.accounts.reward_token_mint.key();
    if let Some(existing_reward) = vault
        .rewards
        .iter_mut()
        .find(|reward| reward.reward_token_mint == reward_token_mint_key)
    {
        existing_reward.schedule = schedule;
    } else {
        require!(vault.rewards.len() < 5, VaultError::RewardsLimitReached);
        vault.rewards.push(TimedReward {
            reward_token_mint: reward_token_mint_key,
            schedule,
            timestamp: clock.unix_timestamp,
        });
    }

    Ok(())
}
