use crate::state::Counter;
use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use anchor_spl::token::{Token, Mint, TokenAccount, TransferChecked, transfer_checked};


fn validate_counter<'info>(counter: Account<'info, Counter>) -> Result<()> {

    if counter.count == 0 {
        return Err(ErrorCode::CounterIsZero.into());
    }
    Ok(())
}

#[derive(Accounts)]
pub struct Step0<'info> {
    #[account(mut, signer)]
    pub user: Signer<'info>,

    #[account(
        init, 
        payer = user, 
        space = 8 + 8 +32 + 1, 
        seeds = [b"counter", random_pubkey.key().as_ref()], 
        bump
    )]
    pub counter: Account<'info, Counter>,

    /// CHECK: This is the random pubkey
    #[account(mut)]
    pub random_pubkey: AccountInfo<'info>,

    #[account(
        mut, 
    )]
    pub ata_from: Account<'info, TokenAccount>,

    #[account(
        mut, 
    )]
    pub ata_to: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Step0>) -> Result<()> {
    ctx.accounts.counter.count = 1;
    ctx.accounts.counter.user = *ctx.accounts.random_pubkey.to_account_info().key;
    ctx.accounts.counter.bump = ctx.bumps.counter;

    msg!("Counter random pubey: {}", ctx.accounts.user.key());

    // transfer tokens
    transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.ata_from.to_account_info(),
                to: ctx.accounts.ata_to.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        50_000_000, // 50 tokens
        ctx.accounts.mint.decimals,
    )?;

    validate_counter(ctx.accounts.counter.clone())?;

    Ok(())
}
