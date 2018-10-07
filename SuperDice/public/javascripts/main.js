var eos;

var chain = {
    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
    jungle: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // jungle testnet
    sys: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' // local developer
};

/**
  Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
*/
//eos = Eos({
//    keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',// private key
//    httpEndpoint: 'https://api.eoslaomao.com',
//    chainId: chain.sys,
//});

eos = Eos({
    httpEndpoint: 'https://api.eoslaomao.com'
});

let betdata = new Array(0,0,0,0,0,0,0,0,0,0);

$(function () {
    $.session.clear();
    //$("#gen_random").click(function (event) {
    //    event.preventDefault();
    //    $('input[name=account_name]').val(get_random_eos_name());
    //    validate_form();
    //});
    //i18n.init();
    
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
});

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

