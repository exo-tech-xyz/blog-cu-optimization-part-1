use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Counter is zero")]
    CounterIsZero,
    #[msg("Invalid ATA mint")]
    InvalidAtaMint,
}
