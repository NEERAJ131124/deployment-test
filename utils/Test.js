const { default: axios } = require("axios");
const { generateAuthToken } = require("./SendSms");
// var request = require('request');
// var options = {
// 'method': 'POST',
// 'url': 'https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-E493254370494D7&flowType=SMS&mobileNumber=9243251888',
// 'headers': {
// 'authToken': eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUU0OTMyNTQzNzA0OTRENyIsImlhdCI6MTczNDYwMjQ2NiwiZXhwIjoxODkyMjgyNDY2fQ.66XukxhmOG0UvfikQK8HSKSKQ3K_7q1A2XkftlEAV637LXWxpdqyG9k1m1Nye471vnqAJ6uotnn0U1KJEJXGoA
// }
// };
// request(options, function (error, response) {
// if (error) throw new Error(error);
// });

exports.testsms = async () => {
  try {
    const authToken = await generateAuthToken();

    const res = await axios.post(
      "https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-E493254370494D7&senderId=UTOMOB&type=SMS&flowType=SMS&mobileNumber=9752661779&message=Welcome to BookMyColdStore. We are delighted to have you here! - Powered by Anthem Infotech",
      {},
      {
        headers: {
          authToken: authToken,
        },
      }
    );
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};

// exports.testsms = async()=>{
//     try {
//         const res = await axios.post('https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-E493254370494D7&flowType=SMS&mobileNumber=9752661779&otpLength=6',{},{
//             'headers': {
//                     'authToken': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUU0OTMyNTQzNzA0OTRENyIsImlhdCI6MTczNDYwMjQ2NiwiZXhwIjoxODkyMjgyNDY2fQ.66XukxhmOG0UvfikQK8HSKSKQ3K_7q1A2XkftlEAV637LXWxpdqyG9k1m1Nye471vnqAJ6uotnn0U1KJEJXGoA'
//                 }
//         })
//       } catch (error) {
//         console.error("Error sending SMS:", error.message);
//         throw error;
//       }
// }
