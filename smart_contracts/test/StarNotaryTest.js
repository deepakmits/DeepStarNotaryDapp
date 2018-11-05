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
    })
})
