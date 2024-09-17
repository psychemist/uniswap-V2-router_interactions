import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

// import "../contracts/interfaces/IERC20.sol";

describe("CustomRouterV2", function () {
    async function deployCustomRouterV2Fixture() {
        const [owner] = await ethers.getSigners();

        const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
        // const TOKEN_HOLDER = "0x82810e81CAD10B8032D39758C8DBa3bA47Ad7092";

        // const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
        const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

        const signer = await ethers.getImpersonatedSigner(TOKEN_HOLDER);
        const ROUTER = await ethers.getContractAt("IUniswapV2Router1", ROUTER_ADDRESS, signer);

        const USDC_CONTRACT = await ethers.getContractAt("IERC20", USDC, signer);
        const DAI_CONTRACT = await ethers.getContractAt("IERC20", DAI, signer);

        const amountInMax = ethers.parseUnits("500", 6);
        const amountOut = ethers.parseUnits("200", 18);
        const deadline = Math.floor(Date.now() / 1000) + (60 * 5)

        const CustomRouterV2 = await ethers.getContractFactory("CustomRouterV2");
        const customRouter = await CustomRouterV2.deploy(ROUTER_ADDRESS);

        return {
            customRouter, owner, signer, ROUTER_ADDRESS, TOKEN_HOLDER,
            USDC, DAI, USDC_CONTRACT, DAI_CONTRACT, ROUTER,
            amountOut, amountInMax, deadline
        };
    }


    describe("Deployment", function () {
        it("Should revert when Zero Address is transaction origin", async function () {
            const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
            const zeroAddressSigner = await ethers.getImpersonatedSigner(ethers.ZeroAddress);

            const CustomRouterV2 = await ethers.getContractFactory("CustomRouterV2");
            await expect(
                CustomRouterV2.connect(zeroAddressSigner).deploy(ROUTER_ADDRESS)
            ).to.be.revertedWithCustomError(CustomRouterV2, "ZeroAddressDetected");
        });

        it("Should return the correct owner", async function () {
            const { customRouter, owner } = await loadFixture(deployCustomRouterV2Fixture);

            expect(await customRouter.owner()).to.equal(owner);
        });

        it("Should return the correct router", async function () {
            const { customRouter, ROUTER_ADDRESS } = await loadFixture(deployCustomRouterV2Fixture);

            expect(await customRouter.router()).to.equal(ROUTER_ADDRESS);
        });
    });


    describe("HandleSwapTokensToExactTokens", function () {
        it("Should revert when Zero Address is transaction origin", async function () {
            const { customRouter, owner, USDC, DAI, amountOut, amountInMax, deadline } = await loadFixture(deployCustomRouterV2Fixture);

            const zeroAddressSigner = await ethers.getImpersonatedSigner(ethers.ZeroAddress);

            await expect(
                customRouter.connect(zeroAddressSigner).handleSwapExact(
                    amountOut, amountInMax, [USDC, DAI], owner, deadline)
            ).to.be.revertedWithCustomError(customRouter, "ZeroAddressDetected");
        });

        it("Should ensure desired token amount is greater than zero", async function () {
            const { customRouter, signer, USDC, DAI, amountOut, amountInMax, deadline } = await loadFixture(deployCustomRouterV2Fixture);

            await expect(
                customRouter.connect(signer).handleSwapExact(
                    0, amountInMax, [USDC, DAI], signer, deadline)
            ).to.be.revertedWithCustomError(customRouter, "ZeroAmountDetected");
        });

        it("Should ensure swapped token amount is greater than zero", async function () {
            const { customRouter, signer, USDC, DAI, amountOut, amountInMax, deadline } = await loadFixture(deployCustomRouterV2Fixture);

            await expect(
                customRouter.connect(signer).handleSwapExact(
                    amountOut, 0, [USDC, DAI], signer, deadline)
            ).to.be.revertedWithCustomError(customRouter, "ZeroAmountDetected");
        });

        it("Should swap tokens for exact tokens with correct balance", async function () {
            const { customRouter, signer, USDC, DAI, USDC_CONTRACT, DAI_CONTRACT, amountOut, amountInMax, deadline } = await loadFixture(deployCustomRouterV2Fixture);

            const usdtBalBefore = await USDC_CONTRACT.balanceOf(signer.address);
            const daiBalBefore = await DAI_CONTRACT.balanceOf(signer.address);

            await USDC_CONTRACT.approve(customRouter, amountInMax);

            const tx = await customRouter.connect(signer).handleSwapExact(amountOut, amountInMax, [USDC, DAI], signer.address, deadline);
            tx.wait();

            const usdtBalAfter = await USDC_CONTRACT.balanceOf(signer.address);
            const daiBalAfter = await DAI_CONTRACT.balanceOf(signer.address);

            expect(usdtBalAfter).to.be.below(usdtBalBefore);
            expect(daiBalAfter).to.be.above(daiBalBefore);
            expect(await customRouter.swapCount()).to.equal(1);
        });
    });
});
