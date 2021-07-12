# Muniyama - The Sovryn API
Muniyama is a REST API that is built for easy and fast retrieval of data in RSK mainnet pertaining to events occuring in [Sovryn's](https://www.sovryn.app/) smart contracts. 

## What Does Muniyama do?
Muniyama uses the [Muniyama-Syncer](https://github.com/DeveloperInProgress/Muniyama-Syncer) which in turn uses [the Covalent API](https://www.covalenthq.com/docs/api/#tag--Class-A) to listen to Sovryn events occuring in RSK mainnet using the event's topics. When a new block is found to be added, the syncer queries for all the events that are in defined in Sovryn contracts and if any of these events are found to be emitted, their data is immediately added to the Muniyama Database which is a postgres database hosted in AWS Relational Database Service. These event data can be queried through the end-point http://muniyamaapi-env.eba-dwmnzgre.us-east-2.elasticbeanstalk.com/events/ . The instructions on using this API will be discussed in the later sections.

## Muniyama Syncer
The Muniyama Syncer can be found in this repository: https://github.com/DeveloperInProgress/Muniyama-Syncer
It is the component in muniyama that enables continous synchronization of the chain data. It is continuously listens for new blocks in RSK Mainnet and uses the covalent api to get event data of events defined in Sovryn contracts using their topic values. If any event data is retrieved from these blocks, the data is added to the Muniyama database. 
Muniyama Syncer is hosted in an AWS EC2 instance.

## Muniyama Database 
Muniyama Database is a postgres database hosted in Amazon RDS. 
A seperate table for each event is present and a seperate attribute for each data in the events is present in the corresponding table. 

Each of the table will contain two identifying attributes alongside event data attributes:

1.) block_num : The block number of the block from which the event was retrieved

2.) tx_hash : The transaction hash of the transaction in which the event occured

The names of the tables present in this Database are:

| Table Name | Pertaining Event |
| ---------- | ---------------: |
|borrow      | [Borrow](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanOpeningsEvents.sol#L17)|
|trade       | [Trade](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanOpeningsEvents.sol#L32)|
|delegatormanagerset|[DelegatorManagerSet](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanOpeningsEvents.sol#L48)|
|depositcollateral|[DepositCollateral](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanMaintenanceEvents.sol#L11)|
|closewithdeposit|[CloseWithDeposit](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanClosingsEvents.sol#L17)|
|closewithswap|[CloseWithSwap](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanClosingsEvents.sol#L31)|
|liquidate|[Liquidate](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanClosingsEvents.sol#L45)|
|swapexcess|[SwapExcess](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanClosingsEvents.sol#L58)|
|loanparamssetup|[LoanParamsSetup](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanSettingsEvents.sol#L16)|
|loanparamsidsetup|[LoanParamsIdSetup](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanSettingsEvents.sol#L25)|
|loanparamsdisabled|[LoanParamsDisabled](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanSettingsEvents.sol#L27)|
|loanparamsiddisabled|[LoanParamsIdDisabled](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/LoanSettingsEvents.sol#L36)|
|paylendingfee|[PayLendingFee](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/FeesEvents.sol#L16)|
|paytradingfee|[PayTradingFee](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/FeesEvents.sol#L18)|
|payborrowingfee|[PayBorrowingFee](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/FeesEvents.sol#L20)|
|earnreward|[EarnReward](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/FeesEvents.sol#L22)|
|setpricefeedcontract|[SetPriceFeedContract](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L16)|
|setswapsimplcontract|[SetSwapsImplContract](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L18)|
|setloanpool|[SetLoanPool](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L20)|
|setsupportedtokens|[SetSupportedTokens](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L22)|
|setlendingfeepercent|[SetLendingFeePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L24)|
|settradingfeepercent|[SetTradingFeePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L26)|
|setborrowingfeepercent|[SetBorrowingFeePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L28)|
|setaffiliatefeepercent|[SetAffiliateFeePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L30)|
|setaffiliatetradingtokenfeepercent(coming soon)|[SetAffiliateTradingTokenFeePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L32)|
|setliquidationincentivepercent|[SetLiquidationIncentivePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L34)|
|setmaxswapsize|[SetMaxSwapSize](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L36)|
|setfeescontroller|[SetFeesController](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L38)|
|setwrbtctoken|[SetWrbtcToken](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L40)|
|setsovrynswapcontractregistryaddress|[SetSovrynSwapContractRegistryAddress](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L42)|
|setprotocoltokenaddress|[SetProtocolTokenAddress](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L48)|
|withdrawfees|[WithdrawFees](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L50)|
|withdrawlendingfees|[WithdrawLendingFees](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L59)|
|withdrawtradingfees|[WithdrawTradingFees](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L61)|
|withdrawborrowingfees|[WithdrawBorrowingFees](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L63)|
|setrolloverbasereward|[SetRolloverBaseReward](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L65)|
|setrebatepercent|[SetRebatePercent](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L67)|
|setprotocoladdress(coming soon)|[SetProtocolAddress](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L69)|
|setminreferralstopayoutaffiliates(coming soon)|[SetMinReferralsToPayoutAffiliates](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L71)|
|setsovtokenaddress(coming soon)|[SetSovTokeAddress](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L73)|
|setlockedsovaddress(coming soon)|[SetLockedSovAddress](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/ProtocolSettingsEvents.sol#L75)|
|loanswap|[LoanSwap](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/SwapsEvents.sol#L16)|
|externalswap|[ExternalSwap](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/SwapsEvents.sol#L25)|
|setaffiliatesreferrer(coming soon)|[SetAffiliatesReferrrer](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/AffiliatesEvents.sol#L9)|
|setaffiliatesreferrerfail(coming soon)|[SetAffiliatesReferrerFail](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/AffiliatesEvents.sol#L11)|
|setusernotfirsttradeflag(coming soon)|[SetUserNotFirstTradeFlag](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/AffiliatesEvents.sol#L13)|
|paytradingfeetoaffililate(coming soon)|[PayTradingFeeToAffiliate](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/AffiliatesEvents.sol#L15)|
|paytradingfeetoaffiliatefail(coming soon)|[PayTradingFeeToAffilateFail](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/AffiliatesEvents.sol#L26)|
|withdrawaffiliatesreferrertokenfee(coming soon)|[WithdrawAffiliatesReferrerTokenFees](https://github.com/DistributedCollective/Sovryn-smart-contracts/blob/298bbc98552356eed6a340b4004970b03bee7a9e/contracts/events/AffiliatesEvents.sol#L36)|
## Querying

Base url of the API is http://muniyamaapi-env.eba-dwmnzgre.us-east-2.elasticbeanstalk.com/

### Paths

1.) `events/{eventName}` :

#### Path Parameters:

1.) eventName

eventName is the name of the event whose past data has to be retrieved. eventName can be any of the values present in `Table Name` column of the table given under  `Muniyama Database` section. The table names are the same as the event names, so there is no need for any seperate referencing of table names, you can use the name of the event whose data is to be queried

#### Query-String Parameters:

1.) fromBlock:

It is the block number starting from which data has to be queried. For example, if `fromBlock` paramater is given as 10, then the querying will be done from block number 10 upto the latest block indexed. 

2.) toBlock:

It is the block number of the block upto which data has to be queried. For, example if `toBlock` parameter is given as 10, then the querying will be done from the genesis block upto block number 10

3.)  table attributes:

A table in the Muniyama Database stores data pertaining to a single event type. Each of the table will have the following attributes:

`block_num` : The block number of the block from which the event data were obtained
`tx_hash` : The transaction hash of the transaction from which the event data were obtained
event parameters : Events may have parameters associated with them. Each of those parameters is an attribute in the table.

For example, consider the Borrow event: 
`
event Borrow(
		address indexed user,
		address indexed lender,
		bytes32 indexed loanId,
		address loanToken,
		address collateralToken,
		uint256 newPrincipal,
		uint256 newCollateral,
		uint256 interestRate,
		uint256 interestDuration,
		uint256 collateralToLoanRate,
		uint256 currentMargin
	);
`

data pertaining to this event is indexed in the `borrow` table. The attributes of this table will be:

`block_num`,`tx_hash`,`user1`,`lender`,`loanId`,`loanToken`,`collateralToken`,`newPrincipal`,`newCollateral`,`interestRate`,`interestDuration`,`collateralToLoanRate`,`currentMargin`

Note that the parameter `user` corresponds to the attribute `user1` in the table, that is because postgres does not allow `user` for an attribute name.

### An Example Query 

The following url queries borrow event that occured between blocks 3400000 and 3400100 where `lender` is '0x849C47f9C259E9D62F289BF1b2729039698D8387' or '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A':

`http://muniyamaapi-env.eba-dwmnzgre.us-east-2.elasticbeanstalk.com/events/borrow?fromBlock=3400000&toBlock=34000100&lender=['0x849C47f9C259E9D62F289BF1b2729039698D8387','0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A']`

## Query Output

The response data for every request is a json containing two fields:

1.) `data` : It contains the data queried from the database. It is a list of json objects, where each json object corresponds to a row in the table queried. The field name of the json will be same as the attribute names of the table, and the value of the field is the data present in corresponding row under the corresponding attribute. The value of this field defaults to null
2.) `error` : If any exceptions occur while querying the database with the parameters, it will be stored in this field. postgres exceptions are always in JSON format. The value of thiws field defaults to null.
