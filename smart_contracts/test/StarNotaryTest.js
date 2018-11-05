const starDefinition = artifacts.require('StarNotary')

contract('StarNotary' , accounts => {
    var owner = accounts[0]
    var contractInstance

    beforeEach(async function(){
        contractInstance = await starDefinition.new({from: owner})            
    })

    describe('StarNotary Basics' , ()=>{
        it('has correct name', async () => {
            assert.equal(await contractInstance.starName(), 'Awesome Star')
        })

        it('star cab be claimed', async () => {
            assert.equal(await contractInstance.starOwner(), 0)
            await contractInstance.claimStar({from : owner})
            assert.equal(await contractInstance.starOwner(), owner)
        })
    })


    describe('star can change owners', ()=>{
        beforeEach(async ()=>{
            assert.equal(await contractInstance.starOwner(),0)
            await contractInstance.claimStar({from : owner})
        })

        it('can be claimed by second user', async () => {
            var secondUser = accounts[1]
            await contractInstance.claimStar({from: secondUser})

            assert.equal(await contractInstance.starOwner(), secondUser)
        })


    })

    
})
