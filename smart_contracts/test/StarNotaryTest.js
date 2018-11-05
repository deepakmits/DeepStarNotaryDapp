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
})
