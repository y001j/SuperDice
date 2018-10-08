'use strict';
var express = require('express');
var router = express.Router();
let eos = require('./common.js').eos;
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Super Dice' });
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post('/rolldice', function (req, res) {
    var content = req.body;//加密的明文；
    //console.log(content.ownerkey + content.activekey);
    console.log(content.account);
   

    eos.transaction(
        {
            actions: [
                {
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: content.account,
                        permission: 'active'
                    }],
                    data: {
                        from: content.account,
                        to: 'chinaplayers',
                        quantity: content.quantity + ' EOS',
                        memo: content.memo
                    }
                }
            ]
        }
        //options
    ).then(trx => {
        console.log("get siged transaction data: ", trx);
        console.log('completed.');
        res.send('success');
    }).catch(
        e => {
            console.log("error", e);
            res.send('transaction failed');
        }
    );
});

module.exports = router;
