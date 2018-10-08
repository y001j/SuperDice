

/**
  Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
*/
//eos = Eos({
//    keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',// private key
//    httpEndpoint: 'https://api.eoslaomao.com',
//    chainId: chain.sys,
//});

const network = { blockchain: 'eos', protocol: 'https', host: 'api.eoslaomao.com', port: 443, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' };
let scatter = null;

ScatterJS.scatter.connect('Super Dice').then(connected => {
    if (!connected) return false;
    scatter = ScatterJS.scatter;
    console.log('sc', scatter);
    const eos = scatter.eos(network, Eos);
    if ($.session.get('userlog') == 'ok') {
        scatter.getIdentity({ accounts: [network] }).then(function (id) {
            const account = id.accounts.find(x => x.blockchain == 'eos');

            eos.getAccount(account.name)
                .then(
                    result => {
                        //console.log(result);
                        $("#balance").val(result.core_liquid_balance);
                    });
            $('#logout').removeClass('hidden');
            $('#login').html(account.name);
            $('#login').attr("disabled", true);
        })
    }
});



let betdata = new Array(0,0,0,0,0,0,0,0,0,0);

$(function () {
    //$.session.clear();
    $.session.remove('token');
    ScatterJS.plugins(new ScatterEOS());

    //if ($.session.get('userlog') === 'ok') {
        
    //    scatter.getIdentity({ accounts: [network] }).then(function (id) {
    //        const account = id.accounts.find(x => x.blockchain == 'eos');
    //        const eos = scatter.eos(network, Eos);
    //        console.log(id);
    //        eos.getAccount(account.name)
    //            .then(
    //                result => {
    //                    //console.log(result);
    //                    $("#balance").val(result.core_liquid_balance);
    //                });
    //        $('#logout').css({ "display": "" });
    //        $('#login').html(account.name);
    //        $('#login').attr("disabled", true);
    //        $.session.set('userlog', 'ok');
    //    });
    //}
   
    
    
 

    $(".choice").on('click', function () {
        //$(".choice").on('click', function () {
        //$.session.set('token', $(this).val());
        //console.log($(this).val());
        //alert($(this).val());
        $.session.set('token', $(this).find('[type="radio"]').val());
        console.log($(this).find('[type="radio"]').val());
        $('#thestake').val(betamount * parseInt($.session.get('token')) / 100);
    }
    );

    $('#bets button').on("click", addToken);

    $('#clear').on("click", clearpage);

    $('#roll').on("click", rolldice);

    $('#login').on('click', function () {
        
       //scatter.suggestNetwork(network);
        const eos = scatter.eos(network, Eos);
        scatter.getIdentity({ accounts: [network] }).then(function (id) {
            const account = id.accounts.find(x => x.blockchain == 'eos');
            console.log(id);
            eos.getAccount(account.name)
                .then(
                    result => {
                        //console.log(result);
                        $("#balance").val(result.core_liquid_balance);
                });
            $('#logout').removeClass('hidden');
            $('#login').html(account.name);
            $('#login').attr("disabled", true);
            $.session.set('userlog', 'ok');
        });
    });
   

    $('#logout').on('click', function () {
        scatter.forgetIdentity();
        $('#logout').addClass('hidden');
        $('#login').text('Login');
        $('#login').attr("disabled", false);
        $.session.set('userlog', 'no');
    });
});

function rolldice() {
    const eos = scatter.eos(network, Eos);
    //        const test = await eos.getKeyAccounts('EOS7PNWhQDMx1SSPp2T7ZGRaVAGbhs6UJk8DniUzfNJGv5rjgCcvZ');
    //        console.log('test', test);
    //        console.log('eos', eos);
    var amount = parseFloat($('#thestake').val()).toFixed(4);
    var memo = '';
    for (var i = 0; i < 10; i++) {
        //console.log(betdata[i]);
        //var rate = parseFloat($.session.get('token'))/100;
        memo += betdata[i].toString() + ':';
        
    }
    console.log(memo);
    memo = memo.substring(0, memo.length - 1);
    memo += '$' + $.session.get('token') + '$';
    const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');
    const opts = { authorization: [`${account.name}@${account.authority}`] };
    console.log('memo', memo);
    console.log('amount', amount + ' EOS');
    eos.transfer(account.name, 'chinaplayers', amount + ' EOS', memo, opts).then(trx => {
        console.log('trx', trx);
        eos.getTableRows(true, 'chinaplayers', account.name, 'account', 3).then(function (value) {

            myDice.roll(value.rows[0].result);
            setTimeout(function () {
                $('#payout').val(value.rows[0].prize);
                eos.getAccount(account.name)
                    .then(
                        result => {
                            //console.log(result);
                            $("#balance").val(result.core_liquid_balance);
                        });
            }, 1800);
           
            
           
        });
    }).catch(err => {
        console.error(err);
    });
}

function slelectToken() {
    $.session.set('token', $(this).val());
    alert($(this).val());
}
let betamount = 0;
function addToken() {
    if (betamount >= 10) {
        alert("staked more than 10 tokens.");
        return;
    }
        
    if ($.session.get('token') != null) {
        var current = 0; 
        if ($(this).find('.betnum').text() == '') {
            $(this).find('.betnum').text('1');
            current = 1;
        }
        else {
            current = parseInt($(this).find('.betnum').text()) + 1;
            $(this).find('.betnum').text(current).toString();
        }
        //var betbtns = $('#bets button');
        
        betamount++;      
        $('#thestake').val(betamount * parseInt($.session.get('token')) / 100);
        betdata[parseInt($(this).val())-1] = current;
        console.log(betdata);
    }
    else {
        $('#checkModal').modal('show');
    }
}

function clearpage() {
    location.reload();
}


//});



