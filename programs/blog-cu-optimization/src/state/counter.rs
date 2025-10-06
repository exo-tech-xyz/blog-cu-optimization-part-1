use anchor_lang::prelude::*;

#[account]
pub struct Counter {
    pub count: u64,
    pub user: Pubkey,
    pub bump: u8,
}
