import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlogCuOptimization } from "../target/types/blog_cu_optimization";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

let lastCU = 0;
function logCUs(name: string, tx: any) {
  let log = tx.raw[tx.raw.length - 2];

  let cu = log.slice(62, 67);

  let delta = null;
  if (lastCU > 0) {
    delta = lastCU - cu;
  }

  console.log(name, cu, "optimization: ", delta);

  lastCU = cu;

  return cu;
}

describe("blog-cu-optimization", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .blogCuOptimization as Program<BlogCuOptimization>;

  const user = anchor.web3.Keypair.generate();
  const receiver = anchor.web3.Keypair.generate();

  const randomPubkey = new anchor.web3.PublicKey(
    "9zzWLsuix6d35Z7LyhJvJBRh5A4W7P9HaLSyDGd64GQw"
  );

  it("Let's uptimize this program!", async () => {
    // airdrop the user
    const signature = await program.provider.connection.requestAirdrop(
      user.publicKey,
      anchor.web3.LAMPORTS_PER_SOL * 2
    );

    await program.provider.connection.confirmTransaction(signature);

    // create a token
    const mint = await createMint(
      program.provider.connection,
      user,
      user.publicKey,
      null,
      6
    ); // 6 decimals (like USDC)
    const ataFrom = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      user,
      mint,
      user.publicKey
    );
    const ataTo = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      user,
      mint,
      receiver.publicKey
    );
    await mintTo(
      program.provider.connection,
      user,
      mint,
      ataFrom.address,
      user,
      100_000_000 // 100 tokens
    );

    const counter = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), randomPubkey.toBuffer()],
      program.programId
    )[0];

    try {
      const tx0 = await program.methods
        .step0()
        .accounts({
          user: user.publicKey,
          counter: counter,
          randomPubkey: randomPubkey,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Initial instruction: ", tx0);

      const tx1 = await program.methods
        .step1()
        .accounts({
          user: user.publicKey,
          counter: counter,
          randomPubkey: randomPubkey,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("With anchor constraints: ", tx1);

      const tx2 = await program.methods
        .step2()
        .accounts({
          user: user.publicKey,
          counter: counter,
          randomPubkey: randomPubkey,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Without deserializing token accounts: ", tx2);

      const tx3 = await program.methods
        .step3()
        .accounts({
          user: user.publicKey,
          counter: counter,
          randomPubkey: randomPubkey,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Without deserializing mint account: ", tx3);

      const tx4 = await program.methods
        .step4()
        .accounts({
          user: user.publicKey,
          counter: counter,
          randomPubkey: randomPubkey,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Without checking seeds: ", tx4);

      const tx5 = await program.methods
        .step5(randomPubkey)
        .accounts({
          user: user.publicKey,
          counter: counter,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Without checking seeds: ", tx5);

      const tx6 = await program.methods
        .step6(randomPubkey)
        .accounts({
          user: user.publicKey,
          counter: counter,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Without the msg!(): ", tx6);

      const tx7 = await program.methods
        .step7(randomPubkey)
        .accounts({
          user: user.publicKey,
          counter: counter,
          ataFrom: ataFrom.address,
          ataTo: ataTo.address,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .simulate();
      logCUs("Saving counter in a local variable: ", tx7);
    } catch (error) {
      console.error(error);
    }
  });
});
