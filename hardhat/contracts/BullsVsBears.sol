//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BullBear is Ownable {
    using SafeMath for uint;

    // State Varibales
    uint256 public bettingPrice;
    uint256 public bettingDate;

    uint256 public ticketPrice;

    uint256 public bettingPoolStartTime;
    uint256 public bettingPoolEndTime;
    
    enum PoolStatus{INACTIVE, ACTIVE, WAITING, CLAIM, COMPLETED}

    PoolStatus public bettingPoolStatus;

    mapping(address => uint256) public bulls;
    mapping(address => uint256) public bears;

    uint256 public noOfBullTickets;
    uint256 public noOfBearTickets;

    uint256 public perTicketReturn;

    enum Winner{TBD, BULLS, BEARS, DRAW}
    Winner public poolWinner;

    AggregatorV3Interface internal priceFeed;

    constructor(
    uint256 _bettingPrice, 
    uint256 _bettingDate, 
    uint256 _ticketPrice, 
    uint256 _bettingPoolStartTime, 
    uint256 _bettingPoolEndTime
    ){
        bettingPrice = _bettingPrice;
        bettingDate = _bettingDate;
        ticketPrice = _ticketPrice;
        bettingPoolStartTime = _bettingPoolStartTime;
        bettingPoolEndTime = _bettingPoolEndTime;
        bettingPoolStatus = PoolStatus.INACTIVE;
        poolWinner = Winner.TBD;

        // The ETH/USD Price Feed reference contract on the Rinkeby Testnet is deployed at the
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }

    modifier activePool(){
        require(block.timestamp >= bettingPoolStartTime, "Sale is not started yet");
        require(block.timestamp <= bettingPoolEndTime, "Betting pool is closed");
        _;
    }

    function updatePoolStatus(_bettingPoolStatus) public onlyOwner {
        bettingPoolStatus = _bettingPoolStatus;

        if(bettingPoolStatus == PoolStatus.ACTIVE){
            // when pool status is active
        }
        else if(bettingPoolStatus == PoolStatus.WAITING){
            //
        }
        else if(bettingPoolStatus == PoolStatus.CLAIM){
            // step1: Transfer the commission to the owner/admin
            transferCommission();

            // step:2 Pick who won the Pool
            poolWinner = pickWinner();

            // step3: calculate Per Ticket Winning Prize
            perTicketReturn = calculateWinningPrice();
        }
        else if(bettingPoolStatus == PoolStatus.COMPLETED){
            //
        }
    }

    function getPoolBalance() public view returns(uint) {
        return address(this).balance;
    }

    function buyBullTicket(uint8 _noOfTickets) payable public activePool returns(bool){
        require(msg.value == mul(_noOfTickets, ticketPrice), "Please pay valid ticket price");
        bulls[msg.sender] += _noOfTickets;

        noOfBullTickets += _noOfTickets;

        return true;
    }

    function buyBearTicket(uint8 _noOfTickets) payable public activePool returns(bool){
       require(msg.value == mul(_noOfTickets, ticketPrice), "Please pay valid ticket price");
        bears[msg.sender] += _noOfTickets;

        noOfBearTickets += _noOfTickets;

        return true;
    }

    function getLatestPrice() internal view returns (int) {
    (
        uint80 roundID, 
        int price,
        uint startedAt,
        uint timeStamp,
        uint80 answeredInRound
    ) = priceFeed.latestRoundData();
        return price;
    }

    function pickWinner() internal returns(string){
        require(bettingPoolStatus == PoolStatus.CLAIM, "Not time to pick the winner");

        uint256 currentPrice = getLatestPrice();

        if(bettingPrice > currentPrice){
            poolWinner = Winner.BEARS;
            return "BEARS";
        } 
        else if(bettingPrice < currentPrice){
            poolWinner = Winner.BULLS;
            return "BULLS";
        }
        else{
            poolWinner = Winner.DRAW;
            return "DRAW";
        }
    }

    function transferCommission() internal payable {
        uint256 commission = address(this).balance.div(20);

        payable(owner()).transfer(commision);
    }

    function calculateWinningPrice() internal return(uint256){
        // 5% commision
        uint256 commission = address(this).balance.div(20);

        // price to be disctributed
        uint256 priceToDistribute = address(this).balance - commission;

        // Bull Wins
        if(poolWinner == Winner.BULLS){  
            // per ticket return
            return priceToDistribute / noOfBullTickets;
        }
        else if(poolWinner == Winner.BEARS){
            // per ticket return
            return priceToDistribute / noOfBearTickets;
        } 
        else if(poolWinner == Winner.DRAW){
            uint256 totalWinner = add(noOfBearTickets, noOfBullTickets);
            // per ticket return
            return priceToDistribute / totalWinner;
        }

    }

    function claimWinning() public payable {
        require(bettingPoolStatus == PoolStatus.CLAIM, "Please wait for the betting end date");

        if(poolWinner == Winner.BULLS){
            require(bulls[msg.sender] != 0, "Only Bulls ticket owner call this");
            
            uint noOfTicket = bulls[msg.sender];

            uint256 amountToPay = mul(noOfTicket, perTicketReturn);

            bulls[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
        else if(poolWinner == Winner.BEARS){
            require(bears[msg.sender] != 0, "Only Bears ticket owner call this");

            uint noOfTicket = bears[msg.sender];

            uint256 amountToPay = mul(noOfTicket, perTicketReturn);

            bears[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
        else if(poolWinner == Winner.DRAW){
            require(bears[msg.sender] != 0 && bulls[msg.sender] != 0, "Only ticket owner call this");

            uint noOfBull = bulls[msg.sender];
            uint noOfBear = bears[msg.sender];

            uint totalUserTickets = add(noOfBear, noOfBull);

            uint256 amountToPay = mul(totalUserTickets, perTicketReturn);

            bears[msg.sender] = 0;
            bulls[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
    }
}

// On 30 JUne, 12:00:00 PM GMT, price of ETH will be Greater than or equal to 1200