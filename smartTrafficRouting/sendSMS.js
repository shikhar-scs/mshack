module.exports = function(mob, user, newIncentive, Weight){
    const request = require('request');

    //let toSend = `http://sms.ssdindia.com/api/sendhttp.php?authkey=16638AqM9XECTnz335b710f78&mobiles=${mob}&message=Thank%20you%20for%20registering%20with%20GrubX.%20Your%20OTP%20is%20${otp}&sender=WEBSMS&route=5`
    let toSend = `http://sms.ssdindia.com/api/sendhttp.php?authkey=16638AqM9XECTnz335b710f78&mobiles=${mob}&message=Thank%20you%20admin2%20for%20giving%20away%20your%20recycled%20waste%20weighing%20${Weight}kg.%20The%20incentive%20for%20the%20same%20is%20${newIncentive}.%20Net%20Incentive%20for%20the%20month%20is%${user.incentive}&sender=WEBSMS&route=5`
    request(toSend, function (error, response, body) {
        if(error) console.log(error);
        else console.log(`OTP Sent to ${mob}`);
    });
}