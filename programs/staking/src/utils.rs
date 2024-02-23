use crate::errors::VaultError;
use crate::constants::*;
use crate::state::*;
use anchor_lang::prelude::*;

//Calculates and updates rewards of the user, stores this data in users staking account on chain
pub fn calculate_and_update_rewards<'info>(
    staking_account: &mut Account<'info, StakingAccount>,
    vault: &Vault,
    clock: &Clock,
    decimals: u32,
) -> Result<()> {
    for (_i, timed_reward) in vault.rewards.iter().enumerate() {

        let time_elapsed = clock.unix_timestamp - staking_account.timestamp;
        let scaled_schedule = timed_reward.schedule as u128 * REWARD_SCALE_FACTOR as u128;
        let scaled_reward_per_second = scaled_schedule / SECONDS_IN_YEAR as u128;
        let scaled_total_reward = scaled_reward_per_second * time_elapsed as u128;

        let multiplier = match staking_account.lockup_option {
            1 => vault.lockup_multiplier_option1,
            2 => vault.lockup_multiplier_option2,
            3 => vault.lockup_multiplier_option3,
            4 => vault.lockup_multiplier_option4,
            _ => return Err(VaultError::InvalidLockupOption.into()),
        };

        let reward_amount = ((scaled_total_reward
            as u128 * staking_account.staked_amount as u128 / 10u128.pow(decimals as u32)) / REWARD_SCALE_FACTOR as u128) as u64;
        let reward_amount_with_multiplier: f64 = (reward_amount as i64 * multiplier / 100) as f64;
        let reward_amount_rounding: f64 = reward_amount_with_multiplier.floor() as f64;
        let reward_amount_final: i64 = reward_amount_rounding as i64;
        let reward_amount_rounded = reward_amount_final as u64;

        if let Some(existing_reward) = staking_account.rewards.iter_mut().find(|reward| reward.reward_token_mint == timed_reward.reward_token_mint) {
            existing_reward.amount = existing_reward.amount.checked_add(reward_amount_rounded).ok_or(VaultError::Overflow)?;
        } else {
            if staking_account.rewards.len() >= 5 {
                staking_account.rewards.remove(0);
            }
            staking_account.rewards.push(Reward {
                reward_token_mint: timed_reward.reward_token_mint,
                amount: reward_amount_rounded,
            });
        }
    }
    Ok(())
}