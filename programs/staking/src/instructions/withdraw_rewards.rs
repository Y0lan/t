use crate::errors::VaultError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct WithdrawRewards<'info> {
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

pub fn withdraw_rewards(ctx: Context<WithdrawRewards>) -> Result<()> {
    let staking_account = &mut ctx.accounts.staking_account;

    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );

    let reward_index = staking_account
        .rewards
        .iter()
        .position(|reward| reward.reward_token_mint == ctx.accounts.token_mint.key());

    match reward_index {
        Some(index) => {
            let current_reward_amount = staking_account.rewards[index].amount;
            let amount = current_reward_amount;

            staking_account.rewards[index].amount = current_reward_amount
                .checked_sub(amount)
                .ok_or(VaultError::Overflow)?;

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

            if staking_account.rewards[index].amount < 5 {
                staking_account.rewards.remove(index);
            }
        }
        None => return Err(VaultError::RewardNotFound.into()),
    }

    Ok(())
}
