import { ethers } from "hardhat";


async function main() {
    // Contract and token holder addresses
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const TOKEN_HOLDER = "0x82810e81CAD10B8032D39758C8DBa3bA47Ad7092";
    // const TOKEN_HOLDER = "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"; // Contract Address
    // const TOKEN_HOLDER = "0x5eE84D30c7EE57F63f71c92247Ff31f95E26916B"; // For MATIC

    // Token addresses
    const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const MATIC_ADDRESS = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";

    const impersonatedSigner = await ethers.getImpersonatedSigner(TOKEN_HOLDER);

    // Deployed contracts from interfaces
    const ROUTER = await ethers.getContractAt("IUniswapV2Router1", ROUTER_ADDRESS, impersonatedSigner);
    const USDT_CONTRACT = await ethers.getContractAt("IERC20", USDT_ADDRESS, impersonatedSigner);
    const DAI_CONTRACT = await ethers.getContractAt("IERC20", DAI_ADDRESS, impersonatedSigner);

    await USDT_CONTRACT.approve(ROUTER, ethers.parseUnits("1000", 6));

    // **** SWAP TOKENS FOR EXACT TOKENS **** //

    const amountInMax = ethers.parseUnits("250", 6); // USDT tokens
    const amountOut = ethers.parseUnits("200", 18); // DAI tokens
    const deadline = Math.floor(Date.now() / 1000) + (60 * 5);

    const usdtBal = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("=====================================================");

    console.log("USDT Balance Before Swap1:", ethers.formatUnits(usdtBal, 6));
    console.log("DAI Balance Before Swap1:", ethers.formatUnits(daiBal, 18));

    await ROUTER.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        [USDT_ADDRESS, DAI_ADDRESS],
        impersonatedSigner.address,
        deadline
    );

    const usdtBalAfter = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("=====================================================");

    console.log("USDT Balance After Swap1:", ethers.formatUnits(usdtBalAfter, 6));
    console.log("DAI Balance After Swap1:", ethers.formatUnits(daiBalAfter, 18));


    // *** SWAP EXACT TOKENS FOR TOKENS *** //

    const amountIn = ethers.parseUnits("200", 6);
    const amountOutMin = ethers.parseUnits("150", 18);

    // await USDT_CONTRACT.approve(ROUTER, amountIn);

    const usdtBalBeforeSwap = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBalBeforeSwap = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);


    console.log("=====================================================");

    console.log(`USDT Balance Before Swap2: ${ethers.formatUnits(usdtBalBeforeSwap, 6)}`);
    console.log(`DAI Balance Before Swap2: ${ethers.formatUnits(daiBalBeforeSwap, 18)}`);

    await ROUTER.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        [USDT_ADDRESS, DAI_ADDRESS],
        impersonatedSigner.address,
        deadline
    );

    const usdtBalAfterSwap = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBalAfterSwap = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("=====================================================");

    console.log(`USDT Balance After Swap2: ${ethers.formatUnits(usdtBalAfterSwap, 6)}`);
    console.log(`DAI Balance After Swap2: ${ethers.formatUnits(daiBalAfterSwap, 18)}`);

    console.log("=====================================================");
}


main().catch((error) => {
    console.log(error)
    process.exit(1);
})