module.exports = function(mob, otp){
    const request = require('request');

    let toSend = `http://sms.ssdindia.com/api/sendhttp.php?authkey=16638AqM9XECTnz335b710f78&mobiles=${mob}&message=Thank%20you%20for%20registering%20with%20GrubX.%20Your%20OTP%20is%20${otp}&sender=WEBSMS&route=5`
    request(toSend, function (error, response, body) {
        if(error) console.log(error);
        else console.log(`OTP Sent to ${mob}`);
    });
}