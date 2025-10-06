pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("2cyA2d1nv15T2WUEXs3qS95ccZ877vNKzKecJdUbaSBX");

#[program]
pub mod blog_cu_optimization {
    use super::*;

    pub fn step0(ctx: Context<Step0>) -> Result<()> {
        step0::handler(ctx)
    }

    pub fn step1(ctx: Context<Step1>) -> Result<()> {
        step1::handler(ctx)
    }

    pub fn step2(ctx: Context<Step2>) -> Result<()> {
        step2::handler(ctx)
    }

    pub fn step3(ctx: Context<Step3>) -> Result<()> {
        step3::handler(ctx)
    }

    pub fn step4(ctx: Context<Step4>) -> Result<()> {
        step4::handler(ctx)
    }

    pub fn step5(ctx: Context<Step5>, random_pubkey: Pubkey) -> Result<()> {
        step5::handler(ctx, random_pubkey)
    }

    pub fn step6(ctx: Context<Step6>, random_pubkey: Pubkey) -> Result<()> {
        step6::handler(ctx, random_pubkey)
    }

    pub fn step7(ctx: Context<Step7>, random_pubkey: Pubkey) -> Result<()> {
        step7::handler(ctx, random_pubkey)
    }
}
