# Muniyama - The Sovryn API
Muniyama is a REST API that is built for easy and fast retrieval of data in RSK mainnet pertaining to events occuring in [Sovryn](https://www.sovryn.app/) network. 

## What Does Muniyama do?
Muniyama uses the [Muniyama-Syncer](https://github.com/DeveloperInProgress/Muniyama-Syncer) which in turn uses [the Covalent API](https://www.covalenthq.com/docs/api/#tag--Class-A) to listen to Sovryn events occuring in RSK mainnet using the event's topics. When a new block is found to be added, the syncer queries for all the events that are  defined in Sovryn contracts and if any of these events are found to occur, their data is immediately added to the Muniyama Database which is a postgres database hosted in AWS Relational Database Service. These event data can be queried through the end-point http://muniyamaapi-env.eba-dwmnzgre.us-east-2.elasticbeanstalk.com/events/ . The instructions on using this API will be discussed in the later sections.

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

The following url queries borrow event that occured between blocks 3400000 and 3500000 where `lender` is '0x849C47f9C259E9D62F289BF1b2729039698D8387' or '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A':

`http://muniyamaapi-env.eba-dwmnzgre.us-east-2.elasticbeanstalk.com/events/borrow?fromBlock=3400000&toBlock=3500000&lender=['0x849C47f9C259E9D62F289BF1b2729039698D8387','0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A']`

## Query Output

The response data for every request is a json containing two fields:

1.) `data` : It contains the data queried from the database. It is a list of json objects, where each json object corresponds to a row in the table queried. The field name of the json will be same as the attribute names of the table, and the value of the field is the data present in corresponding row under the corresponding attribute. The value of this field defaults to null

2.) `error` : If any exceptions occur while querying the database with the parameters, it will be stored in this field. postgres exceptions are always in JSON format. The value of this field defaults to null.

For example, the response for the request given under `An Example Query` section will be:

`{"data":[{"block_num":"3437813","tx_hash":"0xdd82381e588e0e645cde099d3e652a14aa32f5eadded9cdb878d716ea1cd9ec2","user1":"0x93ADf181c0D477568aa8c18014cED7fE5074b561","lender":"0x849C47f9C259E9D62F289BF1b2729039698D8387","loanid":"0xc5623af1df7269719eebf33fdf9a9b526c3a1f569d50b6f26e1dfe56fbdd4142","loantoken":"0xef213441A85dF4d7ACbDaE0Cf78004e1E486bB96","collateraltoken":"0x542fDA317318eBF1d3DEAf76E0b632741A7e677d","newprincipal":"10569251740109022355","newcollateral":"391378489463920","interestrate":"70209350890438292913","interestduration":"2419200","collateraltoloanrate":"40620319999999999708961","currentmargin":"50416698116957434807"},{"block_num":"3439453","tx_hash":"0x72193558f9d7c64c8a82dbd6dbfb6ae6f9227d606146030de39005fa389f1c95","user1":"0x93ADf181c0D477568aa8c18014cED7fE5074b561","lender":"0x849C47f9C259E9D62F289BF1b2729039698D8387","loanid":"0xec63a13e978e4391719c6d5e57e8c59c816b12abdcb160eb2bb04f42d669d1b1","loantoken":"0xef213441A85dF4d7ACbDaE0Cf78004e1E486bB96","collateraltoken":"0x542fDA317318eBF1d3DEAf76E0b632741A7e677d","newprincipal":"10328478138078335306","newcollateral":"388131199384299","interestrate":"41457677499516525260","interestduration":"2419199","collateraltoloanrate":"39976465000000000145519","currentmargin":"50226520307872778058"},{"block_num":"3445748","tx_hash":"0x82dfed22720a1ea880737fe3722309af977d145e2ecc2feb9bfbc75cae7a2362","user1":"0x60f096e59Ab3Eb5b2c5B2C3293d300BDE34658A3","lender":"0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A","loanid":"0x5a410060634e0d6d0565fc957a2f72796564f91262a5a64bb98f57114edc0961","loantoken":"0x542fDA317318eBF1d3DEAf76E0b632741A7e677d","collateraltoken":"0xef213441A85dF4d7ACbDaE0Cf78004e1E486bB96","newprincipal":"1002026994887667354","newcollateral":"53541335526958619908093","interestrate":"2636987461320576702","interestduration":"2419200","collateraltoloanrate":"28093991257149","currentmargin":"50114699490614464730"},{"block_num":"3446018","tx_hash":"0x580de3a3ca31d15562fa517136a1e0495b777bdddaff426c687fa82986b1edd6","user1":"0x33dC98f4d2177051f2b9a4ED5b9fcca6e2eBA8B8","lender":"0x849C47f9C259E9D62F289BF1b2729039698D8387","loanid":"0x791d3b103f78ad24d13749696d6035e00803230cd4edaa992172eb3caad03954","loantoken":"0xef213441A85dF4d7ACbDaE0Cf78004e1E486bB96","collateraltoken":"0x542fDA317318eBF1d3DEAf76E0b632741A7e677d","newprincipal":"25543052747761401059","newcollateral":"1081563788128576","interestrate":"27714308590268658616","interestduration":"2419200","collateraltoloanrate":"35517900000000001455191","currentmargin":"50392652161510489002"},{"block_num":"3451555","tx_hash":"0x6658e7e667fa2253b0a3d537a287d3bd9125f6ac29fc3a935591d1215af2499a","user1":"0x0321Aa423f8A97f3929A65aaFbAA4878a4760312","lender":"0x849C47f9C259E9D62F289BF1b2729039698D8387","loanid":"0xa30480164ee86f5f7cf80173f5975fbf4d50d0663589483489c403b951bd8edf","loantoken":"0xef213441A85dF4d7ACbDaE0Cf78004e1E486bB96","collateraltoken":"0x542fDA317318eBF1d3DEAf76E0b632741A7e677d","newprincipal":"40526841779461929086","newcollateral":"1707815775392783","interestrate":"16946198147429851316","interestduration":"2419199","collateraltoloanrate":"35646500000000000000000","currentmargin":"50215640707513098199"}],
"error":null}`

## Future Works:

1.) Merkle Proofs have to be provided so that third-parties can verify the integrity of data that was pulled off-chain and indexed in Muniyama Database. These proofs are a necessity to ensure trustless-ness

2.) Some of the event data are tagged `(Coming Soon)` in the table given under `Muniyama Database` Section. These event data are not indexed at present because they were not mentioned in the Sovryn contracts at the time of deployment of this API. But they will be indexed soon.

3.) Data can be processed further into data that might be useful for the third parties. These processed data can be made available through separate endpoints in REST API.

4.) A proper domain that is relevant and can be easily remembered must be bought for this API.
