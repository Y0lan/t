use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Unauthorized access.")]
    Unauthorized,
    #[msg("Allowed token is invalid or missing.")]
    InvalidAllowedToken,
    #[msg("Lockup duration is invalid or missing.")]
    InvalidLockupDuration,
    #[msg("Lockup multiplier is invalid or missing (must be above 0).")]
    InvalidLockupMultiplier,
    #[msg("Lockup option is invalid or missing (must be one of the 4 objects).")]
    InvalidLockupOption,
    #[msg("Provided token is not allowed for staking.")]
    NotAllowedToken,
    #[msg("Tokens are still locked.")]
    LockupDurationNotMet,
    #[msg("Arithmetic overflow occurred.")]
    Overflow,
    #[msg("Withdrawal amount exceeds token balance.")]
    InsufficientFunds,
    #[msg("Lockup option mismatch. Use previous lockup time.")]
    LockupMismatch,
    #[msg("Rewards token mint is invalid.")]
    RewardNotFound,
    #[msg("Incorrect token. Use withdrawRewards for rewards.")]
    WrongToken,
    #[msg("Vault is already initialized.")]
    AlreadyInitialized,
    #[msg("Action is too soon. Stake for longer.")]
    TooSoon,
    #[msg("Rewards limit reached. Maximum of 5 rewards per vault.")]
    RewardsLimitReached,
    #[msg("Rewards index is invalid.")]
    InvalidRewardIndex,
}