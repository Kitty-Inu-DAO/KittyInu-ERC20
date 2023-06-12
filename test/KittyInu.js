const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { expect } = require("chai");


  describe("KittyInu", function () {

    async function deployKittyInu() {
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount, otherAccount2] = await ethers.getSigners();
      const KittyInu = await ethers.getContractFactory("KittyInu");
      const kitty = await KittyInu.deploy();
      return { kitty, owner, otherAccount, otherAccount2 };

    }

    describe("Deployment", function () {

      it("Should set the right owner", async function () {
        const { kitty, owner } = await loadFixture(deployKittyInu);
        expect(await kitty.owner()).to.equal(owner.address);
      });

      it("Should set the right NAME", async function () {
        const { kitty } = await loadFixture(deployKittyInu);
        expect(await kitty.NAME()).to.equal("Kitty Inu");
      });

      it("Should set the right SYMBOL", async function () {
        const { kitty } = await loadFixture(deployKittyInu);
        expect(await kitty.SYMBOL()).to.equal("kitty");
      });

      it("Should mint the correct amount", async function () {
        const { kitty, owner } = await loadFixture(deployKittyInu);
        const tSupply = await kitty.tSupply();
        expect(await kitty.balanceOf(owner.address)).to.equal(ethers.utils.parseEther(tSupply.toString()));
      });

      it("Should initialize transferProtection as false", async function () {
        const { kitty } = await loadFixture(deployKittyInu);
        expect(await kitty.transferProtection()).to.equal(false);
      });

    });

    describe("Transfers", function () {

        it("Deployer Should Transfer Right Amount", async function () {
          const { kitty, owner, otherAccount } = await loadFixture(deployKittyInu);
          const amount_send = 50000;
          const deployerBalance = await kitty.balanceOf(owner.address);
          const newDeployerBalance = deployerBalance.sub(amount_send);

          await kitty.connect(owner).transfer(otherAccount.address, amount_send);
          expect(await kitty.balanceOf(otherAccount.address)).to.equal(amount_send);
          expect(await kitty.balanceOf(owner.address)).to.equal(newDeployerBalance);
        });

        it("Peer to Peer Transfers Send Right Amount", async function () {

            const { kitty, owner, otherAccount, otherAccount2 } = await loadFixture(deployKittyInu);
            const amount_send = 50000;
            const amount_send2 = 30000;

            await kitty.connect(owner).transfer(otherAccount.address, amount_send);
            const accountBalance1 = await kitty.balanceOf(otherAccount.address);

            const newAccountBalance1 = accountBalance1.sub(amount_send2);
            await kitty.connect(otherAccount).transfer(otherAccount2.address, amount_send2);
            
            expect(await kitty.balanceOf(otherAccount.address)).to.equal(newAccountBalance1);
            expect(await kitty.balanceOf(otherAccount2.address)).to.equal(amount_send2);
          });

    });

    describe("Transfer Protection", function () { 

        it("Transfer Protection can be enabled", async function () {
            const { kitty, owner} = await loadFixture(deployKittyInu);

            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            expect(await kitty.transferProtection()).to.equal(true);
          });


        it("Transfer Protection can be enabled then disabled", async function () {
            const { kitty, owner} = await loadFixture(deployKittyInu);

            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            expect(await kitty.transferProtection()).to.equal(true);

            await kitty.connect(owner).setProtectionSettingsTransfer(false);
            expect(await kitty.transferProtection()).to.equal(false);
        });

        it("Transfer Protection when enabled should prevent blocked addresses from transferring", async function () {
            const { kitty, owner, otherAccount, otherAccount2 } = await loadFixture(deployKittyInu);

            const amount_send = 50000;
            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);

            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);
            await expect(kitty.connect(otherAccount).transfer(otherAccount2.address, amount_send)).to.be.reverted;
        });

        it("Transfer Protection when disabled should allow blocked addresses to transfer", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);

            const amount_send = 50000;
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);

            expect(await kitty.balanceOf(otherAccount.address)).to.equal(amount_send);
        });

        it("Transfer Protection can only be set by the owner", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
            await expect(kitty.connect(otherAccount).setProtectionSettingsTransfer(true)).to.be.reverted;
        });

    });

    describe("Block List", function () { 

        it("Users can be added to block list", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);

            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);
            expect(await kitty.isBlocked(otherAccount.address)).to.equal(true);
        });

        it("Users can be removed from block list", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);

            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);
            expect(await kitty.isBlocked(otherAccount.address)).to.equal(true);

            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, false);
            expect(await kitty.isBlocked(otherAccount.address)).to.equal(false);
        });

        it("Block list can only be changed by the owner", async function () {
            const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);
            await expect(kitty.connect(otherAccount).setBlockedAddresses(otherAccount2.address, true)).to.be.reverted;
        });

        it("Block list users cannot transfer as `from` if transfer protection is on", async function () {
            const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);

            const amount_send = 50000;
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);

            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);

            await expect(kitty.connect(otherAccount).transfer(otherAccount2.address, amount_send)).to.be.reverted;
        });

        it("Block list users cannot recieve as `to` if transfer protection is on", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
            const amount_send = 50000;

            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);

            await expect(kitty.connect(owner).transfer(otherAccount.address, amount_send)).to.be.reverted;
        });

        it("Block list users can recieve as `to` if transfer protection is off", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
            const amount_send = 50000;

            await kitty.connect(owner).setProtectionSettingsTransfer(false);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);
            
            expect(await kitty.balanceOf(otherAccount.address)).to.equal(amount_send);
        });

        it("Block list users can send as `from` if transfer protection is off", async function () {
            const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);
            const amount_send = 50000;
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);

            await kitty.connect(owner).setProtectionSettingsTransfer(false);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);

            await kitty.connect(otherAccount).transfer(otherAccount2.address, amount_send);

            expect(await kitty.balanceOf(otherAccount2.address)).to.equal(amount_send);
        });

        it("Block list users can send as `from` if they are removed off blocklist and transfer protection is on", async function () {
            const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);

            const amount_send = 50000;
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);

            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);

            await expect(kitty.connect(otherAccount).transfer(otherAccount2.address, amount_send)).to.be.reverted;

            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, false);
            await kitty.connect(otherAccount).transfer(otherAccount2.address, amount_send);

            expect(await kitty.balanceOf(otherAccount2.address)).to.equal(amount_send);

        });

        it("Block list users can recieve as `to` if they are removed off block list and transfer protection is on", async function () {
            const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
            const amount_send = 50000;

            await kitty.connect(owner).setProtectionSettingsTransfer(true);
            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);

            await expect(kitty.connect(owner).transfer(otherAccount.address, amount_send)).to.be.reverted;

            await kitty.connect(owner).setBlockedAddresses(otherAccount.address, false);
            await kitty.connect(owner).transfer(otherAccount.address, amount_send);

            expect(await kitty.balanceOf(otherAccount.address)).to.equal(amount_send);
        });

    });

    describe("isBlocked", function () {

      it("returns false when not blocked", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        expect(await kitty.isBlocked(otherAccount.address)).to.equal(false);
      });

      it("returns true when blocked", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).setBlockedAddresses(otherAccount.address, true);
        expect(await kitty.isBlocked(otherAccount.address)).to.equal(true);
      });

    });

    describe("Pausing and Unpausing", function () {

      it("Pause can only be called by the owner", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await expect(kitty.connect(otherAccount).pause()).to.be.reverted;
      });

      it("Unpause can only be called by the owner", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).pause();
        await expect(kitty.connect(otherAccount).unpause()).to.be.reverted;
      });

      it("Transfers should not work when paused", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).pause();
        const amount_send = 50000;
        await expect(kitty.connect(owner).transfer(otherAccount.address, amount_send)).to.be.reverted;
      });

      it("Transfers should work after unpausing", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).pause();
        const amount_send = 50000;
        await expect(kitty.connect(owner).transfer(otherAccount.address, amount_send)).to.be.reverted;
        await kitty.connect(owner).unpause();
        await kitty.connect(owner).transfer(otherAccount.address, amount_send);
        expect(await kitty.balanceOf(otherAccount.address)).to.equal(amount_send);
      });

    });

    describe("Ownership Transfer", function () {

      it("Transfer Ownership can only be called by the owner", async function () {
        const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);
        await expect(kitty.connect(otherAccount).transferOwnership(otherAccount2.address)).to.be.reverted;
      });

      it("When ownership is transferred, prior owner loses privileges to block list", async function () {
        const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await expect(kitty.connect(owner).setBlockedAddresses(otherAccount2.address, true)).to.be.reverted;
      });

      it("When ownership is transferred, prior owner loses privileges to transfer protection setting", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await expect(kitty.connect(owner).setProtectionSettingsTransfer(true)).to.be.reverted;
      });

      it("When ownership is transferred, prior owner loses privileges to renounce ownership", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await expect(kitty.connect(owner).renounceOwnership()).to.be.reverted;
      });

      it("When ownership is transferred, prior owner loses privileges to pause", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await expect(kitty.connect(owner).pause()).to.be.reverted;
      });

      it("When ownership is transferred, prior owner loses privileges to unpause", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await kitty.connect(otherAccount).pause();
        await expect(kitty.connect(owner).unpause()).to.be.reverted;
      });

      it("When ownership is transferred, prior owner loses privileges to snapshot", async function () {
        const { kitty, owner, otherAccount} = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await expect(kitty.connect(owner).snapshot()).to.be.reverted;
      });

    });

    describe("Burn & burnFrom", function () { 

      it("burnFrom: You cannot burn someone elses tokens", async function () {
        const { kitty, owner, otherAccount, otherAccount2} = await loadFixture(deployKittyInu);
        const amount_send = 50000;
        await kitty.connect(owner).transfer(otherAccount.address, amount_send);
        await expect(kitty.connect(otherAccount2).burnFrom(otherAccount.address, amount_send)).to.be.reverted;
      });

    });

    describe("snapshot", function () { 

      it("owner can take a snapshot", async function () {
        const { kitty, owner } = await loadFixture(deployKittyInu);
        await kitty.connect(owner).snapshot();
      });

      it("other accounts cannot take snapshots", async function () {
        const { kitty, owner, otherAccount } = await loadFixture(deployKittyInu);
        await expect(kitty.connect(otherAccount).snapshot()).to.be.reverted;
      });

      it("new owner can take snapshots", async function () {
        const { kitty, owner, otherAccount } = await loadFixture(deployKittyInu);
        await kitty.connect(owner).transferOwnership(otherAccount.address);
        await kitty.connect(otherAccount).snapshot();
      });

    });


});