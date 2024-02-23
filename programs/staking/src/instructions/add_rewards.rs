use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct AddRewards<'info> {
    #[account(mut, has_one = vault_owner)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub reward_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        seeds = [b"spl_rewards".as_ref(), vault.key().as_ref(), reward_token_mint.key().as_ref()],
        bump,
        payer = vault_owner,
        token::mint = reward_token_mint,
        token::authority = vault,
    )]
    pub vault_reward_token_account: Account<'info, TokenAccount>,
    pub reward_token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub vault_owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn add_rewards(ctx: Context<AddRewards>, reward_amount: u64) -> Result<()> {

    let vault = &mut ctx.accounts.vault;
    require!(
        vault.vault_owner == ctx.accounts.vault_owner.key(),
        VaultError::Unauthorized
    );

    let transfer_cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.reward_token_account.to_account_info(),
            to: ctx.accounts.vault_reward_token_account.to_account_info(),
            authority: ctx.accounts.vault_owner.to_account_info(),
        },
    );
    token::transfer(transfer_cpi_ctx, reward_amount)?;

    Ok(())
}
