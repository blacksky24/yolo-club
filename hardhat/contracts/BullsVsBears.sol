//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BullsVsBears {
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

    uint256 perTicketReturn;

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

    // functions

    modifier saleStarted(){
        require(block.timestamp >= bettingPoolStartTime, "sale is not started yet");
        require(block.timestamp <= bettingPoolEndTime, "sale is not started yet");
        _;
    }

    function getPoolBalance() public view returns(uint) {
        return address(this).balance;
    }

    function buyBullTicket() payable public saleStarted returns(bool){
        require(msg.value == ticketPrice, "Please pay valid ticket price");
        bulls[msg.sender] += 1;

        noOfBullTickets += 1;

        return true;
    }

    function buyBearTicket() payable public saleStarted returns(bool){
        require(msg.value == ticketPrice, "Please pay valid ticket price");
        bears[msg.sender] += 1;

        noOfBearTickets += 1;

        return true;
    }

    function getLatestPrice() public view returns (int) {
    (
        uint80 roundID, 
        int price,
        uint startedAt,
        uint timeStamp,
        uint80 answeredInRound
    ) = priceFeed.latestRoundData();
        return price;
    }

    function pickWinner() public returns(string){
        require(block.timestamp == )
        uint256 currentPrice = getLatestPrice();

        if(bettingPrice > currentPrice){
            poolWinner = Winner.BEARS;
            return "BEARS"
        } 
        else if(bettingPrice < currentPrice){
            poolWinner = Winner.BULLS;
            return "BULLS"
        }
        else{
            poolWinner = Winner.DRAW;
            return "DRAW"
        }
    }

    function calculateWinningPrice() public return(uint256){
        // 5% commision
        uint256 commision = address(this).balance.div(20);

        // price to be disctributed
        uint256 priceToDistribute = address(this).balance - commision;

        // Bull Wins
        if(poolWinner == Winner.BULLS){  
            // per ticket return
            perTicketReturn = priceToDistribute / noOfBullTickets;
        }
        else if(poolWinner == Winner.BEARS){
            // per ticket return
            perTicketReturn = priceToDistribute / noOfBearTickets;
        } 
        else if(poolWinner == Winner.DRAW){
            uint256 totalWinner = add(noOfBearTickets, noOfBullTickets);
            // per ticket return
            perTicketReturn = priceToDistribute / totalWinner;
        }

        return perTicketReturn;
    }

    function claimWinning() public payable {
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

            uint totalTicket = add(noOfBear, noOfBull);

            uint256 amountToPay = mul(totalWinner, perTicketReturn);

            bears[msg.sender] = 0;
            bulls[msg.sender] = 0;

            payable(msg.sender).transfer(amountToPay);
        }
    }

}

// On 30 JUne, 12:00:00 PM GMT, price of ETH will be Greater than or equal to 1200