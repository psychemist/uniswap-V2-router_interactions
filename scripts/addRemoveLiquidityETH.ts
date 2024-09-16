import { ethers } from "hardhat";


async function main() {
    // Contract and token holder addresses
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const TOKEN_HOLDER = "0x82810e81CAD10B8032D39758C8DBa3bA47Ad7092";

    // Token addresses
    const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const USDT_WETH_PAIR_ADDRESS = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852";
    // const USDC_WETH_PAIR_ADDRESS = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";

    const impersonatedSigner = await ethers.getImpersonatedSigner(TOKEN_HOLDER);

    // Deploy contracts using interfaces
    const ROUTER = await ethers.getContractAt("IUniswapV2Router1", ROUTER_ADDRESS, impersonatedSigner);
    const USDT_CONTRACT = await ethers.getContractAt("IERC20", USDT_ADDRESS, impersonatedSigner);
    const WETH_CONTRACT = await ethers.getContractAt("IERC20", WETH_ADDRESS, impersonatedSigner);
    const LP_CONTRACT = await ethers.getContractAt("IERC20", USDT_WETH_PAIR_ADDRESS, impersonatedSigner);

    // Approce token contracts to spend on behalf of impersonated siner
    await USDT_CONTRACT.approve(ROUTER, ethers.parseUnits("500", 6));
    await WETH_CONTRACT.approve(ROUTER, ethers.parseEther("0.2"));
    await LP_CONTRACT.approve(ROUTER, ethers.parseUnits("0.1", 18));


    // **** ADD LIQUIDITY ETH **** //

    const amountTokenDesired = ethers.parseUnits("125", 6);
    const amountTokenMin = ethers.parseUnits("50", 6);
    const amountETHDesired = ethers.parseEther("0.05");
    const amountETHMin = ethers.parseEther("0.04");
    const deadline = Math.floor(Date.now() / 1000) + (60 * 5);

    const usdtBal = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const ethBal = await ethers.provider.getBalance(impersonatedSigner.address);
    const lpBal = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==========================================================");

    console.log("USDT Balance Before Adding Liquidity", ethers.formatUnits(usdtBal, 6));
    console.log("ETH Balance Before Adding Liquidity", ethers.formatEther(ethBal));
    console.log("LP Balance Before Adding Liquidity", ethers.formatUnits(lpBal, 18));

    await ROUTER.addLiquidityETH(
        USDT_ADDRESS,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        impersonatedSigner.address,
        deadline,
        { value: amountETHDesired }
    );

    const usdtNewBal = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const ethNewBal = await ethers.provider.getBalance(impersonatedSigner.address);
    const lpNewBal = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==========================================================");

    console.log("USDT Balance After Adding Liquidity", ethers.formatUnits(usdtNewBal, 6));
    console.log("ETH Balance After Adding Liquidity", ethers.formatEther(ethNewBal));
    console.log("LP Balance After Adding Liquidity", ethers.formatUnits(lpNewBal, 18));


    // *** REMOVE LIQUIDITY ETH **** //

    const liquidity = ethers.parseUnits("0.0000005", 18);
    const amountTokenMinimum = ethers.parseUnits("50", 6);
    const amountETHMinimum = ethers.parseEther("0.02");

    const usdtNewBalBefore = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const ethNewBalBefore = await ethers.provider.getBalance(impersonatedSigner.address);
    const lpNewBalBefore = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==========================================================");

    console.log("USDT Balance Before Removing Liquidity", ethers.formatUnits(usdtNewBalBefore, 6));
    console.log("ETH Balance Before Removing Liquidity", ethers.formatEther(ethNewBalBefore));
    console.log("LP Balance Before Removing Liquidity", ethers.formatUnits(lpNewBalBefore, 18));

    await ROUTER.removeLiquidityETH(
        USDT_ADDRESS,
        liquidity,
        amountTokenMinimum,
        amountETHMinimum,
        impersonatedSigner.address,
        deadline,
    );

    const usdtNewBalAfter = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const ethNewBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);
    const lpNewBalAfter = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==========================================================");

    console.log("USDT Balance After Removing Liquidity", ethers.formatUnits(usdtNewBalAfter, 6));
    console.log("ETH Balance After Removing Liquidity", ethers.formatEther(ethNewBalAfter));
    console.log("LP Balance After Removing Liquidity", ethers.formatUnits(lpNewBalAfter, 18));

    console.log("==========================================================");
}



main().catch((error) => {
    console.log(error)
    process.exit(1);
})