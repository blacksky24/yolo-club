//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BullBear is Ownable {

    // State Varibales
    uint256 public bettingPrice;

    uint256 public resultPrice;

    uint256 public ticketPrice;
    uint256 public commissionPercent;
    
    enum PoolStatus{INACTIVE, ACTIVE, WAITING, CLAIM, COMPLETED}

    PoolStatus public bettingPoolStatus;

    mapping(address => uint256) public bulls;
    mapping(address => uint256) public bears;

    uint256 public noOfBullTickets;
    uint256 public noOfBearTickets;

    uint256 public perTicketReturn;

    enum Winner{TBD, BULLS, BEARS, DRAW}
    Winner public poolWinner;

    constructor(
    uint256 _bettingPrice, 
    uint256 _ticketPrice,
    uint256 _commissionPercent
    ){
        bettingPrice = _bettingPrice;
        ticketPrice = _ticketPrice;
        commissionPercent = _commissionPercent;
        bettingPoolStatus = PoolStatus.INACTIVE;
        poolWinner = Winner.TBD;
    }

    function updatePoolActive() public onlyOwner {
        bettingPoolStatus = PoolStatus.ACTIVE;
    }

    function updatePoolWaiting() public onlyOwner {
        bettingPoolStatus = PoolStatus.WAITING;

        transferCommission();
    }

    function updatePoolClaim(uint256 currentPrice) public onlyOwner {
        bettingPoolStatus = PoolStatus.CLAIM;

        resultPrice = currentPrice;

        poolWinner = pickWinner();

        perTicketReturn = calculateWinningPrice();
    }

    function updatePoolCompleted() public onlyOwner {
        bettingPoolStatus = PoolStatus.COMPLETED;

        // call this after 30 days of claiming
        payable(owner()).transfer(getPoolBalance());
    }

    function getPoolBalance() public view returns(uint) {
        return address(this).balance;
    }

    function buyBullTicket(uint8 _noOfTickets) payable public returns(bool){
        require(bettingPoolStatus == PoolStatus.ACTIVE, "Pool is not active");
        require(msg.value == _noOfTickets * ticketPrice, "Please pay valid ticket price");

        bulls[msg.sender] += _noOfTickets;
        noOfBullTickets += _noOfTickets;

        return true;
    }

    function buyBearTicket(uint8 _noOfTickets) payable public returns(bool){
        require(bettingPoolStatus == PoolStatus.ACTIVE, "Pool is not active");
        require(msg.value == _noOfTickets * ticketPrice, "Please pay valid ticket price");

        bears[msg.sender] += _noOfTickets;
        noOfBearTickets += _noOfTickets;

        return true;
    }

    function transferCommission() public payable onlyOwner{
        uint256 commission = (getPoolBalance() * commissionPercent) / 100;
        payable(owner()).transfer(commission);
    }

    function pickWinner() internal view returns(Winner){
        require(bettingPoolStatus == PoolStatus.CLAIM, "Not time to pick the winner");

        if(bettingPrice > resultPrice){
            return Winner.BEARS;
        } 
        else if(bettingPrice < resultPrice){
            return Winner.BULLS;
        }
        else if(bettingPrice == resultPrice){
            return Winner.DRAW;
        }

        return Winner.TBD;
    }

    function calculateWinningPrice() internal view returns(uint256){
        require(bettingPoolStatus == PoolStatus.CLAIM, "Winner is not Picked yet");
        if(poolWinner == Winner.BULLS){  
            return getPoolBalance() / noOfBullTickets;
        }
        else if(poolWinner == Winner.BEARS){
            return getPoolBalance() / noOfBearTickets;
        } 
        else if(poolWinner == Winner.DRAW){
            // DRAW. Distribute back to all users
            return getPoolBalance() / (noOfBullTickets + noOfBearTickets);
        }
        return 0;
    }

    function claimWinning() public payable {
        require(bettingPoolStatus == PoolStatus.CLAIM, "Please wait for the betting end date");

        if(poolWinner == Winner.BULLS){
            require(bulls[msg.sender] != 0, "Only Bulls ticket owner call this");
            

            uint256 amountToPay = bulls[msg.sender] * perTicketReturn;

            bulls[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
        else if(poolWinner == Winner.BEARS){
            require(bears[msg.sender] != 0, "Only Bears ticket owner call this");

            uint256 amountToPay = bears[msg.sender] * perTicketReturn;

            bears[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
        else if(poolWinner == Winner.DRAW){
            require(bears[msg.sender] != 0 || bulls[msg.sender] != 0, "Only ticket owner call this");

            uint totalUserTickets = bulls[msg.sender] + bears[msg.sender];

            uint256 amountToPay = totalUserTickets * perTicketReturn;

            bears[msg.sender] = 0;
            bulls[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
    }
}
