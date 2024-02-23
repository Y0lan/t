use crate::errors::VaultError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateVaultSettings<'info> {
    #[account(mut, has_one = vault_owner)]
    pub vault: Account<'info, Vault>,
    pub vault_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn update_vault_settings(
    ctx: Context<UpdateVaultSettings>,
    new_allowed_token: Pubkey,
    new_lockup_duration_options: [i64; 4],
    new_lockup_multiplier_options: [i64; 4],
    reward_update_index: u8,
    reward_update_token_id: Pubkey,
    reward_update_amount: u64,
) -> Result<()> {
    const SYSTEM_PROGRAM_ID: Pubkey = Pubkey::new_from_array([0; 32]); 

    if new_allowed_token == Pubkey::default() {
        return Err(VaultError::InvalidAllowedToken.into());
    }

    let vault = &mut ctx.accounts.vault;
    require!(
        vault.vault_owner == *ctx.accounts.vault_owner.key,
        VaultError::Unauthorized
    );

    require!(
        new_lockup_duration_options[0] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        new_lockup_duration_options[1] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        new_lockup_duration_options[2] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        new_lockup_duration_options[3] >= 0,
        VaultError::InvalidLockupDuration
    );
    require!(
        new_lockup_multiplier_options[0] > 0,
        VaultError::InvalidLockupMultiplier
    );
    require!(
        new_lockup_multiplier_options[1] > 0,
        VaultError::InvalidLockupMultiplier
    );
    require!(
        new_lockup_multiplier_options[2] > 0,
        VaultError::InvalidLockupMultiplier
    );
    require!(
        new_lockup_multiplier_options[3] > 0,
        VaultError::InvalidLockupMultiplier
    );

    if reward_update_index as usize >= vault.rewards.len() {
        return Err(VaultError::InvalidRewardIndex.into());
    }

    if reward_update_token_id == SYSTEM_PROGRAM_ID {
        vault.rewards.remove(reward_update_index as usize);
    } else {
        let reward = &mut vault.rewards[reward_update_index as usize];
        reward.reward_token_mint = reward_update_token_id;
        reward.schedule = reward_update_amount;
    }

    vault.allowed_token = new_allowed_token;
    vault.lockup_duration_option1 = new_lockup_duration_options[0];
    vault.lockup_duration_option2 = new_lockup_duration_options[1];
    vault.lockup_duration_option3 = new_lockup_duration_options[2];
    vault.lockup_duration_option4 = new_lockup_duration_options[3];
    vault.lockup_multiplier_option1 = new_lockup_multiplier_options[0];
    vault.lockup_multiplier_option2 = new_lockup_multiplier_options[1];
    vault.lockup_multiplier_option3 = new_lockup_multiplier_options[2];
    vault.lockup_multiplier_option4 = new_lockup_multiplier_options[3];

    Ok(())
}