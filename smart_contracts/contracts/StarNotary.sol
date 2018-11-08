pragma solidity ^0.4.23;

import "./ERC721Token.sol";

contract StarNotary is ERC721Token { 

    struct Star { 
        string name;
        string cent;
        string dec;
        string mag;
        string story;    
    }

    //Token ID <=> Star Id
    //tokenid to Star object
    mapping(uint256 => Star) public tokenIdToStarInfo; 
    //starId to price
    mapping(uint256 => uint256) public starsForSale;
    //mapping storing encoded string of star cordinates to true when created.
    mapping(string => bool) private existingStars;
    //starAdded event
    event starAdded(address owner);

    function createStar(string _name, string _cent, string _dec, string _mag, string story, uint256 _tokenId) public { 

        require(!checkIfStarExist(_cent,_dec,_mag),"Star with given coordinates already exists");
        Star memory newStar = Star(_name,_cent,_dec,_mag,story);
        tokenIdToStarInfo[_tokenId] = newStar;
        //adding to encoded maps
        existingStars[string(abi.encode(_cent,_dec,_mag))] = true;
        ERC721Token.mint(_tokenId);
        emit starAdded(msg.sender);
    }

    function checkIfStarExist(string _cent, string _dec, string _mag) public view returns (bool){
        return existingStars[string(abi.encode(_cent,_dec,_mag))];
    }


    /* struct Star { 
        string name;
    }
    
    mapping(uint256 => Star) public tokenIdToStarInfo;

    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, uint256 _tokenId) public { 
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        ERC721Token.mint(_tokenId);
    } */

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);

        require(msg.value >= starCost);

        clearPreviousStarState(_tokenId);

        transferFromHelper(starOwner, msg.sender, _tokenId);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }

        starOwner.transfer(starCost);
    }

    function clearPreviousStarState(uint256 _tokenId) private {
        //clear approvals 
        tokenToApproved[_tokenId] = address(0);

        //clear being on sale 
        starsForSale[_tokenId] = 0;
    }

    function tokenIdToStarInfo(uint256 tokenId) public view returns(string, string, string, string, string) {
        return (tokenIdToStarInfo[tokenId].name, tokenIdToStarInfo[tokenId].story, tokenIdToStarInfo[tokenId].cent, 
        tokenIdToStarInfo[tokenId].dec, tokenIdToStarInfo[tokenId].mag);
    }
}