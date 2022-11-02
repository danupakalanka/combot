const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
	ALIVE_MSG: process.env.ALIVE_MSG === undefined ? 'Alive Now' : process.env.ALIVE_MSG,
	ALIVE_LOGO: process.env.ALIVE_LOGO === undefined ? `https://telegra.ph/file/5f2c2213e479a958564bd.jpg` : process.env.ALIVE_LOGO,

	PRO_LOGO: process.env.PRO_LOGO === undefined ? 'https://telegra.ph/file/58cf25199cd0c1dcd5695.jpg' : process.env.PRO_LOGO,
	MY_LOGO: process.env.MY_LOGO === undefined ? 'https://telegra.ph/file/59ae30418cdc0f288a002.jpg' : process.env.MY_LOGO,

	FOOTER: process.env.FOOTER === undefined ? 'ⒸPowered By @NadithPro' : process.env.FOOTER,
	TVFOOTER: process.env.TVFOOTER === undefined ? 'ⒸPowered By @NadithPro' : process.env.TVFOOTER,

	OWNER_NAME: process.env.OWNER_NAME === undefined ? 'NadithPro' : process.env.OWNER_NAME,
	OWNER_NUMBER: process.env.OWNER_NUMBER === undefined ? '94761327688' : process.env.OWNER_NUMBER,

};
