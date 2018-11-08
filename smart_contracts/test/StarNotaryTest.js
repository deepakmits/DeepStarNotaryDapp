const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })

    //Creation of Star 
    describe('can create a star', () => { 
        let tokenId1 = 1
        it('can create a star and get its name', async function () { 
            await this.contract.createStar('Deep star1', 'ra_032.155', 'dec_121.874', 'mag_245.978', 'My Deep Star Story 1', tokenId1, {from: accounts[0]})
            const star1 = await this.contract.tokenIdToStarInfo(tokenId1);
            assert.equal(star1[0], 'Deep star1');
        })

        let tokenId2 = 2
        it('can create a second star also and get its name too', async function () { 
            await this.contract.createStar('Deep star2', 'ra_033.156', 'dec_122.874', 'mag_246.97', 'My Deep Star Story 2', tokenId2, {from: accounts[0]})
            let star2 = await this.contract.tokenIdToStarInfo(tokenId2);
            assert.equal(star2[0], 'Deep star2');
        })
    })

    describe('check if start already exists', () => {
        let tokenId1 = 1
        let user1 = accounts[1]
        beforeEach(async function () {
            await this.contract.createStar('Deep star1', 'ra_032.155', 'dec_121.874', 'mag_245.978', 'My Deep Star Story 1', tokenId1, {from: user1})
        })

        it('check if start exists', async function () {
            assert.equal(await this.contract.checkIfStarExist('ra_032.155','dec_121.874','mag_245.978'),true) ;
        }) 
    })


    describe('matching star info', () => {
        let tokenId1 = 1
        let user1 = accounts[1]
        beforeEach(async function () {
            await this.contract.createStar('Deep star1', 'ra_032.155', 'dec_121.874', 'mag_245.978', 'My Deep Star Story 1', tokenId1, {from: user1})
        })
        
        it('star info matches', async function () {
            let star1 = await this.contract.tokenIdToStarInfo(tokenId1);

            assert.equal(star1[0],'Deep star1') ;
            assert.equal(star1[1],'My Deep Star Story 1') ;
            assert.equal(star1[2],'ra_032.155') ;
            assert.equal(star1[3],'dec_121.874') ;
            assert.equal(star1[4],'mag_245.978') ;
        }) 
    })


    describe('buying and selling stars', () => { 

        let user1 = accounts[1]
        let user2 = accounts[2]

        let starId = 1
        let starPrice = web3.toWei(.05, "ether")

        beforeEach(async function () {
            await this.contract.createStar('Deep star1', 'ra_032.155', 'dec_121.874', 'mag_245.978', 'My Deep Star Story 1', starId, {from: user1})
        })

        describe('user1 can sell a star', () => { 
            //star is added to starsforsale mapping.
            it('user1 can put up their star for sale', async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
                assert.equal(await this.contract.starsForSale(starId), starPrice)
            })
            //funds are increased by starprice of star1 after selling it for user 1
            it('user1 gets the funds after selling a star', async function () { 
                
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})

                let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                await this.contract.buyStar(starId, {from: user2, value: starPrice})
                let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

                assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                            balanceOfUser1AfterTransaction.toNumber())
            })
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })
            //buying successful
            it('user2 is the owner of the star after they buy it', async function () { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice})
                //check new owner of star
                assert.equal(await this.contract.ownerOf(starId), user2)
            })
            //change is returned to new owners account
            it('user2 correctly has their balance changed', async function () { 
                let overpaidAmount = web3.toWei(.07, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice:0})
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
            })
        })
    })

    //approval to other user
    describe('user1 giving approval to transfer star to user2', () => {

        let user1 = accounts[1]
        let user2 = accounts[2]

        let starId = 1

        beforeEach(async function () {
            await this.contract.createStar('Deep star1', 'ra_032.155', 'dec_121.874', 'mag_245.978', 'My Deep Star Story 1', starId, {from: user1})
            tx = await this.contract.approve(user2, starId, {from: user1});   
        })

        //user2 is approved
        it('user2 is new approved for tokenid1', async function() {
            assert.equal(await this.contract.getApproved(starId), user2);
        })

        //user2 can executed transfer
        it('user2 can transfer the tokenId1', async function(){
            await this.contract.transferFrom(user1, user2, starId, {from: user2});
            assert.equal(await this.contract.ownerOf(starId), user2);
        })

        //correct event is emitted
        it('emitted event is correct', async () => {
            assert.equal(tx.logs[0].event, 'Approval');
        })
    })

   
    //approval to opeartor/exchange
    describe('user1 giving approval to operator/exchange to transfer', () => {
        let user1 = accounts[1]
        let operator = accounts[3]

        let starId = 1;
        let tx ;
        beforeEach(async function() { 
            await this.contract.createStar('Deep star1', 'ra_032.155', 'dec_121.874', 'mag_245.978', 'My Deep Star Story 1', starId, {from: user1});
            tx = await this.contract.setApprovalForAll(operator, true, {from: user1});  
        })

        //operator account3 is approved
        it('operator is newly approved', async function() {
            assert.equal(await this.contract.isApprovedForAll(user1, operator), true);
        })

        //correct event is emitted
        it('emitted event is correct', async function() {
            assert.equal(tx.logs[0].event, 'ApprovalForAll');
        })
    })
})