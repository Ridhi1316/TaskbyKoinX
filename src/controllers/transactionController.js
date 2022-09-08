const axios = require('axios');
const transactionModel = require('../models/transactionModel');
const ethereumModel = require('../models/priceModel');

//1. Fetch crypto transaction of a User.
const userTransaction = async (req, res) => {
    try {
        let address = req.params.address
        if (!req.body.address) {
            res.status(400).send({ message: "Please provide address for fetch details" });
        }

        let getData = {
            method: 'get',
            url: `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=P21HC9GZD49ZS9178H2GTFW3PNC3KKQ6C3`
        }
        let result = await axios(getData);
        let data = result.data;
        res.status(200).send({ msg: data, status: true });
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
}

//2. Output list of transactions by this address
const addressTransaction = async (req, res) => {
    try {
        if (!req.body.address) {
            res.status(400).send({ message: "Please provide address for transaction" });
        }
        
        let data = await transactionModel.create(req.body);
        return res.status(201).send({ status: true, message: "Successfully get details", details: data });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

//

//3. Fetch the price of Ethereum & store it in database

const ethereumPrice = async (req, res) => {
    try {
        let options = {
            method: 'get',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`
        }
        let result = await axios(options);
        let data = result.data

        let value = data.ethereum.inr;
        let update = {};
        update['ethereum.inr'] = value;
        await ethereumModel.findOneAndUpdate({ _id: "6319c038baf584581d4722ce" }, update)

        res.status(200).send({ status: true, message: "successfully get details", details: data })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//Get current balance and current price of ether
const getEther = async (req, res) => {
    try {
        let address = req.params.address;
        if (!address) {
            res.status(400).send({ status: false, message: "Please send address" })
        }
        let found = await transactionModel.find({ address });

        let balance = (found[0].transaction)
        // console.log(balance)
        let ethereumPrice = await ethereumModel.find();
        let price = ethereumPrice[0].ethereum.inr;
        let result = {
            userBalance: balance,
            ethereumPrice: price
        };
        res.status(201).send({ status: true, message: "User Details Fetched", data: result });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}


//Transaction basis on choice
const transactionBetweenUsers = async (req, res) => {
    try {
        if (!req.query.choice) {
            res.status(400).send({ status: false, message: "Please send the choice" })
        }

        if (!req.params.address1) {
            res.status(400).send({ status: false, message: "Please send the address of sender" })
        }

        if (!req.params.address2) {
            res.status(400).send({ status: false, message: "Please send the address of receiver" })
        }
        //Send from user1[address] to user2[address]
        if (req.query.choice === "from") {
            let senderData = await transactionModel.findOne({ address: req.params.address1 })
            let user1Cash = senderData.transaction;

            let receiverData = await transactionModel.findOne({ address: req.params.address2 })
            let user2Cash = receiverData.transaction

            let update1Data = {};
            let update2Data = {};

            update2Data["transaction"] = user1Cash + user2Cash
            update1Data["transaction"] = 0;

            await transactionModel.findOneAndUpdate({ address: req.params.address1 }, update1Data)
            await transactionModel.findOneAndUpdate({ address: req.params.address2 }, update2Data)

            let data = await transactionModel.findOne({ address: req.params.address1 })
            return res.status(200).send({ status: true, message: "Successfully get details", details: data })
        } else {
            // To user1[address] from user2[address]

            let sender = await transactionModel.findOne({ address: req.params.address2 })
            let senderCash = sender.transaction;

            let receiver = await transactionModel.findOne({ address: req.params.address1 })
            let receiverCash = receiver.transaction;

            let update1 = {}, update2 = {};

            update1["transaction"] = senderCash + receiverCash
            update2['transaction'] = 0;

            await transactionModel.findOneAndUpdate({ address: req.params.address1 }, update1)
            await transactionModel.findOneAndUpdate({ address: req.params.address2 }, update2)

            let data = await transactionModel.findOne({ address: req.params.address1 })
            return res.status(200).send({ status: true, message: "Successfully get details", details: data })
        }

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}


module.exports = {
    userTransaction,
    addressTransaction,
    ethereumPrice,
    getEther,
    transactionBetweenUsers
}