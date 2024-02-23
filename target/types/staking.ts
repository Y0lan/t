export type Staking = {
  "version": "0.1.0",
  "name": "staking",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultRef",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "It is safe because it is only for creating a seed."
          ]
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "allowedToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "allowedToken",
          "type": "publicKey"
        },
        {
          "name": "lockupDurationOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        },
        {
          "name": "lockupMultiplierOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        }
      ]
    },
    {
      "name": "initializeAccount",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vault",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateVaultSettings",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAllowedToken",
          "type": "publicKey"
        },
        {
          "name": "newLockupDurationOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        },
        {
          "name": "newLockupMultiplierOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        },
        {
          "name": "rewardUpdateIndex",
          "type": "u8"
        },
        {
          "name": "rewardUpdateTokenId",
          "type": "publicKey"
        },
        {
          "name": "rewardUpdateAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeTokens",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lockupOption",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addRewards",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawRewards",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addTimedRewards",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "schedule",
          "type": "u64"
        }
      ]
    },
    {
      "name": "storeRewards",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "unlockTimestamp",
            "type": "i64"
          },
          {
            "name": "lockupOption",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "Reward"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultOwner",
            "type": "publicKey"
          },
          {
            "name": "allowedToken",
            "type": "publicKey"
          },
          {
            "name": "vaultTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "lockupDurationOption1",
            "type": "i64"
          },
          {
            "name": "lockupDurationOption2",
            "type": "i64"
          },
          {
            "name": "lockupDurationOption3",
            "type": "i64"
          },
          {
            "name": "lockupDurationOption4",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption1",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption2",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption3",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption4",
            "type": "i64"
          },
          {
            "name": "vaultRef",
            "type": "publicKey"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "TimedReward"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Reward",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TimedReward",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "schedule",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized access."
    },
    {
      "code": 6001,
      "name": "InvalidAllowedToken",
      "msg": "Allowed token is invalid or missing."
    },
    {
      "code": 6002,
      "name": "InvalidLockupDuration",
      "msg": "Lockup duration is invalid or missing."
    },
    {
      "code": 6003,
      "name": "InvalidLockupMultiplier",
      "msg": "Lockup multiplier is invalid or missing (must be above 0)."
    },
    {
      "code": 6004,
      "name": "InvalidLockupOption",
      "msg": "Lockup option is invalid or missing (must be one of the 4 objects)."
    },
    {
      "code": 6005,
      "name": "NotAllowedToken",
      "msg": "Provided token is not allowed for staking."
    },
    {
      "code": 6006,
      "name": "LockupDurationNotMet",
      "msg": "Tokens are still locked."
    },
    {
      "code": 6007,
      "name": "Overflow",
      "msg": "Arithmetic overflow occurred."
    },
    {
      "code": 6008,
      "name": "InsufficientFunds",
      "msg": "Withdrawal amount exceeds token balance."
    },
    {
      "code": 6009,
      "name": "LockupMismatch",
      "msg": "Lockup option mismatch. Use previous lockup time."
    },
    {
      "code": 6010,
      "name": "RewardNotFound",
      "msg": "Rewards token mint is invalid."
    },
    {
      "code": 6011,
      "name": "WrongToken",
      "msg": "Incorrect token. Use withdrawRewards for rewards."
    },
    {
      "code": 6012,
      "name": "AlreadyInitialized",
      "msg": "Vault is already initialized."
    },
    {
      "code": 6013,
      "name": "TooSoon",
      "msg": "Action is too soon. Stake for longer."
    },
    {
      "code": 6014,
      "name": "RewardsLimitReached",
      "msg": "Rewards limit reached. Maximum of 5 rewards per vault."
    },
    {
      "code": 6015,
      "name": "InvalidRewardIndex",
      "msg": "Rewards index is invalid."
    }
  ]
};

export const IDL: Staking = {
  "version": "0.1.0",
  "name": "staking",
  "instructions": [
    {
      "name": "initializeVault",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultRef",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "It is safe because it is only for creating a seed."
          ]
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "allowedToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "allowedToken",
          "type": "publicKey"
        },
        {
          "name": "lockupDurationOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        },
        {
          "name": "lockupMultiplierOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        }
      ]
    },
    {
      "name": "initializeAccount",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vault",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateVaultSettings",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAllowedToken",
          "type": "publicKey"
        },
        {
          "name": "newLockupDurationOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        },
        {
          "name": "newLockupMultiplierOptions",
          "type": {
            "array": [
              "i64",
              4
            ]
          }
        },
        {
          "name": "rewardUpdateIndex",
          "type": "u8"
        },
        {
          "name": "rewardUpdateTokenId",
          "type": "publicKey"
        },
        {
          "name": "rewardUpdateAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeTokens",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lockupOption",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addRewards",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rewardAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawRewards",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addTimedRewards",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "schedule",
          "type": "u64"
        }
      ]
    },
    {
      "name": "storeRewards",
      "accounts": [
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "stakedAmount",
            "type": "u64"
          },
          {
            "name": "unlockTimestamp",
            "type": "i64"
          },
          {
            "name": "lockupOption",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "Reward"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vaultOwner",
            "type": "publicKey"
          },
          {
            "name": "allowedToken",
            "type": "publicKey"
          },
          {
            "name": "vaultTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "lockupDurationOption1",
            "type": "i64"
          },
          {
            "name": "lockupDurationOption2",
            "type": "i64"
          },
          {
            "name": "lockupDurationOption3",
            "type": "i64"
          },
          {
            "name": "lockupDurationOption4",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption1",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption2",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption3",
            "type": "i64"
          },
          {
            "name": "lockupMultiplierOption4",
            "type": "i64"
          },
          {
            "name": "vaultRef",
            "type": "publicKey"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "TimedReward"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Reward",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TimedReward",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "schedule",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized access."
    },
    {
      "code": 6001,
      "name": "InvalidAllowedToken",
      "msg": "Allowed token is invalid or missing."
    },
    {
      "code": 6002,
      "name": "InvalidLockupDuration",
      "msg": "Lockup duration is invalid or missing."
    },
    {
      "code": 6003,
      "name": "InvalidLockupMultiplier",
      "msg": "Lockup multiplier is invalid or missing (must be above 0)."
    },
    {
      "code": 6004,
      "name": "InvalidLockupOption",
      "msg": "Lockup option is invalid or missing (must be one of the 4 objects)."
    },
    {
      "code": 6005,
      "name": "NotAllowedToken",
      "msg": "Provided token is not allowed for staking."
    },
    {
      "code": 6006,
      "name": "LockupDurationNotMet",
      "msg": "Tokens are still locked."
    },
    {
      "code": 6007,
      "name": "Overflow",
      "msg": "Arithmetic overflow occurred."
    },
    {
      "code": 6008,
      "name": "InsufficientFunds",
      "msg": "Withdrawal amount exceeds token balance."
    },
    {
      "code": 6009,
      "name": "LockupMismatch",
      "msg": "Lockup option mismatch. Use previous lockup time."
    },
    {
      "code": 6010,
      "name": "RewardNotFound",
      "msg": "Rewards token mint is invalid."
    },
    {
      "code": 6011,
      "name": "WrongToken",
      "msg": "Incorrect token. Use withdrawRewards for rewards."
    },
    {
      "code": 6012,
      "name": "AlreadyInitialized",
      "msg": "Vault is already initialized."
    },
    {
      "code": 6013,
      "name": "TooSoon",
      "msg": "Action is too soon. Stake for longer."
    },
    {
      "code": 6014,
      "name": "RewardsLimitReached",
      "msg": "Rewards limit reached. Maximum of 5 rewards per vault."
    },
    {
      "code": 6015,
      "name": "InvalidRewardIndex",
      "msg": "Rewards index is invalid."
    }
  ]
};