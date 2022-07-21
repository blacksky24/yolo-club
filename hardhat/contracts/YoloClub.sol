//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BullsVsBears.sol";

contract YoloClub{

    BullsVsBears public deployedContract;

    event newContract(address _contractAddress);

    function createPool(
        uint256 _bettingPrice, 
        uint256 _ticketPrice,
        uint256 _commissionPercent
    ) public returns(address){
        deployedContract = new BullsVsBears(_bettingPrice, _ticketPrice, _commissionPercent);
        emit newContract(address(deployedContract));
        return address(deployedContract);
    }   

}