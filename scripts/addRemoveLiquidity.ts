import { ethers } from "hardhat";


async function main() {
    // Contract and token holder addresses
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const TOKEN_HOLDER = "0x82810e81CAD10B8032D39758C8DBa3bA47Ad7092";

    // Token addresses
    const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const USDT_DAI_PAIR_ADDRESS = "0xB20bd5D04BE54f870D5C0d3cA85d82b34B836405";

    const impersonatedSigner = await ethers.getImpersonatedSigner(TOKEN_HOLDER);

    // Deploy contracts using interfaces
    const ROUTER = await ethers.getContractAt("IUniswapV2Router1", ROUTER_ADDRESS, impersonatedSigner);
    const USDT_CONTRACT = await ethers.getContractAt("IERC20", USDT_ADDRESS, impersonatedSigner);
    const DAI_CONTRACT = await ethers.getContractAt("IERC20", DAI_ADDRESS, impersonatedSigner);
    const LP_CONTRACT = await ethers.getContractAt("IERC20", USDT_DAI_PAIR_ADDRESS, impersonatedSigner);

    await USDT_CONTRACT.approve(ROUTER, ethers.parseUnits("500", 6));
    await DAI_CONTRACT.approve(ROUTER, ethers.parseUnits("500", 18));
    await LP_CONTRACT.approve(ROUTER, ethers.parseUnits("0.1", 18));


    // **** ADD LIQUIDITY **** //

    const amountADesired = ethers.parseUnits("100", 6);
    const amountBDesired = ethers.parseUnits("100", 18);
    const amountAMin = ethers.parseUnits("50", 6);
    const amountBMin = ethers.parseUnits("50", 18);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 5);

    const usdtBal = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);
    const lpBal = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==============================================================");

    console.log("USDT Balance Before Adding Liquidity", ethers.formatUnits(usdtBal, 6));
    console.log("DAI Balance Before Adding Liquidity", ethers.formatUnits(daiBal, 18));
    console.log("LP Balance Before Adding Liquidity", ethers.formatUnits(lpBal, 18));

    await ROUTER.addLiquidity(
        USDT_ADDRESS,
        DAI_ADDRESS,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        impersonatedSigner.address,
        deadline
    );

    const usdtNewBal = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiNewBal = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);
    const lpNewBal = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==============================================================");

    console.log("USDT Balance After Adding Liquidity", ethers.formatUnits(usdtNewBal, 6));
    console.log("DAI Balance After Adding Liquidity", ethers.formatUnits(daiNewBal, 18));
    console.log("LP Balance After Adding Liquidity", ethers.formatUnits(lpNewBal, 18));


    // *** REMOVE LIQUIDITY **** //

    const liquidity = ethers.parseUnits("0.00005", 18);
    const amountAMinimum = ethers.parseUnits("50", 6);
    const amountBMinimum = ethers.parseUnits("50", 18);

    const usdtNewBalBefore = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiNewBalBefore = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);
    const lpNewBalBefore = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==============================================================");

    console.log("USDT Balance Before Removing Liquidity", ethers.formatUnits(usdtNewBalBefore, 6));
    console.log("DAI Balance Before Removing Liquidity", ethers.formatUnits(daiNewBalBefore, 18));
    console.log("LP Balance Before Removing Liquidity", ethers.formatUnits(lpNewBalBefore, 18));

    await ROUTER.removeLiquidity(
        USDT_ADDRESS,
        DAI_ADDRESS,
        liquidity,
        amountAMinimum,
        amountBMinimum,
        impersonatedSigner.address,
        deadline
    );

    const usdtNewBalAfter = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiNewBalAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);
    const lpNewBalAfter = await LP_CONTRACT.balanceOf(impersonatedSigner.address);

    console.log("==============================================================");

    console.log("USDT Balance After Removing Liquidity", ethers.formatUnits(usdtNewBalAfter, 6));
    console.log("DAI Balance After Removing Liquidity", ethers.formatUnits(daiNewBalAfter, 18));
    console.log("LP Balance After Removing Liquidity", ethers.formatUnits(lpNewBalAfter, 18));

    console.log("==============================================================");
}



main().catch((error) => {
    console.log(error)
    process.exit(1);
})