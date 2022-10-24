
const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = ''
const owner = ['761327688']
const axios = require('axios')
const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})

	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot Connected')
		}
	})

	conn.ev.on('creds.update', saveState)

	conn.ev.on('messages.upsert', async (mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return

			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid

			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''


			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'

			const isMe = botNumber.includes(senderNumber)
			const isowner = owner.includes(senderNumber) || isMe

			const reply = (teks) => {
				conn.sendMessage(from, { text: teks }, { quoted: mek })
			}

			switch (command) {

				//......................................................Commands..............................................................\\

				case 'start':
				case 'sir':
				case 'Start': {

					const startmsg = `
🔰 තුෂාන් ධර්මේන්ද්‍ර Online Accounting වෙත ඔබ සාදරයෙන් පිලිගනිමි.

🔰 ඔබගේ අවශ්‍යතාවය පහත *'View Menu'* භාවිත කර තෝරාගන්න.

🍁 Thank You 🍁
━━━━━━━━━━━`

					const sections = [
						{
							title: "🍁 තුෂාන් ධර්මේන්ද්‍ර Online Accounting 🍁",
							rows: [
								{ title: "☞︎︎︎  පන්තියට සහභාගීවන ආකාරය", rowId: prefix + 'howreg' },
								{ title: "☞︎︎︎  පන්තියට ලියාපදිංචි වීමට", rowId: "creg" },
								{ title: "☞︎︎︎  පන්ති ගාස්තු ගෙවීම", rowId: "pymnt" },
								{ title: "☞︎︎︎  Group වලට Links ලබා ගැනීමට", rowId: "glinks" },
								{ title: "☞︎︎︎  පංති ගාස්තු පිලිබද විස්තර", rowId: "cfees" },
								{ title: "☞︎︎︎  පංති කාලසටහන", rowId: "ctable" },
								{ title: "☞︎︎︎  නිබන්ධන ලබා ගන්නා ආකාරය", rowId: "tutesget" },
								{ title: "☞︎︎︎  මගහැරුන පාඩම් ලබා ගැනීමට", rowId: "prevless" },
								{ title: "☞︎︎︎  තුෂාන් ධර්මේන්ද්‍ර සර් ගැන", rowId: "about" }
							]
						}
					]
					const listMessage = {
						text: startmsg,
						footer: config.TVFOOTER,
						title: "*🍁 🅆🄴🄻🄲🄾🄼🄴 🍁*",
						buttonText: "View Menu",
						sections
					}
					await conn.sendMessage(from, { image: { url: 'https://telegra.ph/file/8b8d49a533ae75d867f59.jpg' } }),
						await conn.sendMessage(from, listMessage)
				}
					break

					case 'alive': {

						const startmsg = `
	🔰 තුෂාන් ධර්මේන්ද්‍ර Online Accounting වෙත ඔබ සාදරයෙන් පිලිගනිමි.
	
	🔰 ඔබගේ අවශ්‍යතාවය පහත *'View Menu'* භාවිත කර තෝරාගන්න.
	
	🍁 Thank You 🍁
	━━━━━━━━━━━`
	
						const sections = [
							{
								title: "🍁 තුෂාන් ධර්මේන්ද්‍ර Online Accounting 🍁",
								rows: [
									{ title: "☞︎︎︎  පන්තියට සහභාගීවන ආකාරය", rowId: prefix + 'howreg' },
									{ title: "☞︎︎︎  පන්තියට ලියාපදිංචි වීමට", rowId: "clreg" },
									{ title: "☞︎︎︎  පන්ති ගාස්තු ගෙවීම", rowId: "pymnt" },
									{ title: "☞︎︎︎  Group වලට Links ලබා ගැනීමට", rowId: "glinks" },
									{ title: "☞︎︎︎  පංති ගාස්තු පිලිබද විස්තර", rowId: "cfees" },
									{ title: "☞︎︎︎  පංති කාලසටහන", rowId: "ctable" },
									{ title: "☞︎︎︎  නිබන්ධන ලබා ගන්නා ආකාරය", rowId: "tutesget" },
									{ title: "☞︎︎︎  මගහැරුන පාඩම් ලබා ගැනීමට", rowId: "prevless" },
									{ title: "☞︎︎︎  තුෂාන් ධර්මේන්ද්‍ර සර් ගැන", rowId: "about" }
								]
							}
						]
						const listMessage = {
							text: startmsg,
							footer: config.TVFOOTER,
							title: "*🍁 🅆🄴🄻🄲🄾🄼🄴 🍁*",
							buttonText: "View Menu",
							sections
						}
							await conn.sendMessage(from, listMessage)
					}
						break

				//......................................................How To Register..............................................................\\

				case 'howreg': {

					const startmsg = `*🍁𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓣𝓸 𝓝𝓪𝓭𝓲𝓽𝓱𝓟𝓻𝓸 𝓑𝓸𝓽 🍁*

🔰 NadithPro මෙනුව ලබා ගැනීමට *'Menu'* බටන් එක භාවිත කරන්න.

🔰 ප්‍රධාන මෙනුව ලබා ගැනීමට *'Start'* බටන් එක භාවිත කරන්න.
				
 𖣔 Thank You 𖣔
 ━━━━━━━━━━`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } },
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.PRO_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				//......................................................Register Forms..............................................................\\

				case 'clreg': {

					const startmsg = `*🍁 පන්තියට ලියාපදිංචි වීමට 🍁*

🔰 පහළ Link එකෙන් ලබා දී ඇති *Form* එක පුරවා අපගේ Online Class එකේ Register වන්න.

🔰 ඔබ සහභාගී වීමට බලාපොරොත්තු වන පංතියද ඊට ඇතුළත් කරන්න.

  》 https://forms.gle/Lx11hrHtYxZLYh539
	
🍁 Thank You 🍁
━━━━━━━━━━━`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.PRO_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				//......................................................Payment..............................................................\\

				case 'pymnt': {

					const startmsg = `🍁 පන්ති ගාස්තු ගෙවීම 🍁

🔰 

🍁 Thank You 🍁
━━━━━━━━━━━`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.PRO_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break
				
				//......................................................Group Links..............................................................\\

				case 'glinks': {

					const startmsg = `🍁 Group වලට Links ලබා ගැනීමට 🍁

🔰 ඔබට සහභාගීවීමට අවශ්‍ය පන්තියට අදාල Group එක පහළින් තෝරා ඊට සම්බන්ධ වන්න.


۞ A/L 2024 Theory | Accounting  》
  
》https://chat.whatsapp.com/GDgefl4KS8WC8NGFywxNBJ
												
۞ A/L 2023 Revision | Accounting  》
  
》https://chat.whatsapp.com/Hkbsqm2HQLsEecds4jTZMK
												
۞ O/L Commerce | Grade - 10  》
  
》https://chat.whatsapp.com/IUUKoR0YNj0KKailrErytA
												
۞ O/L Commerce | Grade - 11  》
  
》https://chat.whatsapp.com/DCdjRz5MmRd2UMdtcCzRtr
												
۞ IABF Accounting | IBSL Bank Exam  》
  
》https://chat.whatsapp.com/J8A4Ua8IsFN5Kph1G3zYYn

🍁 Thank You 🍁
━━━━━━━━━━━`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.PRO_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				//.......................................................Class Fees...............................................................\\

				case 'cfees': {

					const startmsg = `*🍁 පංති ගාස්තු පිලිබද විස්තර 🍁*

۞ A/L 2024 Theory | Accounting  》
	𓃰 Rs.
												
۞ A/L 2023 Revision | Accounting  》
	𓃰 Rs.
												
۞ O/L Commerce | Grade - 10  》
	𓃰 Rs.
												
۞ O/L Commerce | Grade - 11  》
	𓃰 Rs.
												
۞ IABF Accounting | IBSL Bank Exam  》
	𓃰 Rs.

`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.MY_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

				//.......................................................Time Table...............................................................\\

				case 'cfees': {

					const startmsg = `*🍁 පංති කාලසටහන 🍁*

۞ A/L 2024 Theory | Accounting  》
	𓃰 Date - 
	𓃰 Time - 
												
۞ A/L 2023 Revision | Accounting  》
	𓃰 Date - 
	𓃰 Time - 
												
۞ O/L Commerce | Grade - 10  》
	𓃰 Date - 
	𓃰 Time - 
												
۞ O/L Commerce | Grade - 11  》
	𓃰 Date - 
	𓃰 Time - 
												
۞ IABF Accounting | IBSL Bank Exam  》
	𓃰 Date - 
	𓃰 Time - 

`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.MY_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

									//.......................................................Get Tutes...............................................................\\

				case 'tutesget': {

					const startmsg = `*🍁 නිබන්ධන ලබා ගැනීම 🍁*

🔰 ඉගැන්වීමට නියමිත විශය නිර්දේශය ආවරණය වන පරිදි සකස්කරන ලද ගුණාත්මක නිබන්ධන කට්ටලයක් සැපයේ.

🔰 එම නිබන්ධන *PDF* ලෙස අදාළ WhatsApp Group වලට ලබා දෙනු ඇත.

🔰 මුද්‍රණය කරන ලද නිබන්ධන ලබා ගැනීමට අපේක්ෂා කරන අයට, අදාළ නිබන්ධන *Cash On Delivery* ක්‍රමයට තැපැල් මාර්ගයෙන් +94 76 132 7688 යන WhatsApp අංකය හා සම්බන්ධ වීමෙන් ලබා ගැනීමමේ හැකියාව ඇත.


۞ WhatsApp Number  》

》 https://wa.me/94761327688

  `

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
					]
					const buttonMessage = {
						caption: startmsg,
						footer: config.FOOTER,
						templateButtons: templateButtons,
						image: { url: config.MY_LOGO }
					}
					await conn.sendMessage(from, buttonMessage)
				}
					break

					case 'prevless': {

						const startmsg = `*🍁 මගහැරුන පාඩම් ලබා ගැනීම 🍁*
	
🔰 මගහැරුනු පාඩම් වෙතොත් ඒ පිළිබඳව +94 76 132 7688 යන whatsApp අංකට මගහැරුනු පාඩම හා වීඩියෝව කුමක්දැයි කෙටිපණිවිඩයක් උඔමු කළ යුතුය.
	
🔰 ඒවා ලබා ගැනීමට අවශ්‍ය ගාස්තු හා ක්‍රමවේදය එවිට දැනුවත් කරනු ලැබේ.
	
	
۞ WhatsApp Number  》
	
》 https://wa.me/94761327688
	
`
	
						const templateButtons = [
							{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
						]
						const buttonMessage = {
							caption: startmsg,
							footer: config.FOOTER,
							templateButtons: templateButtons,
							image: { url: config.MY_LOGO }
						}
						await conn.sendMessage(from, buttonMessage)
					}
						break

						case 'about': {

							const startmsg = `*🍁 තුෂාන් ධර්මේන්ද්‍ර සර් ගැන 🍁*
		
𓃰  ඔබගේ ගුරුවරයා, තුෂාන් ධර්මේන්ද්‍ර වන අතර ඔහු පහත සුදුසුකම් සපිරූ අයෙකි.
		
𓃰  ශ්‍රී ජයවර්ධනපුර විශ්ව විද්‍යාලයේ ව්‍යාපාර පරිපාලනවේදී (විශේෂ) උපාධිධරයෙක්.

𓃰  ශී ලංකා වරලත් ගණකාධිකාරී ආයතනයේ සහතිකලත් ව්‍යාපාර ගණකාධිකාරීවරයෙකි.

𓃰  ශ්‍රී ලංකා බැංකු කරුවන්ගේ ආයතනයේ (IBSL) හි *CBF* හා *DBF* විභාග හැදෑරූ අයෙකි.

𓃰  කැළණිය විශ්ව විද්‍යාලයේ *ආර්ථික විද්‍යාව* පිළිබඳ පශ්චාත් උපාධිධාරියෙකි.

𓃰  වෘත්තිය ගණකාධිකාරීවරයෙකි.

𓃰  උසස් පෙළ ගිණුම්කරණය, AAT, Banking, CMA ඇතුළු වෘත්තීය විභාග සඳහා	දේශන පැවැත්වීමෙහි 12 වසරක අත්දැකීම් සපිරූ අයෙකි.

🍁 Thank You 🍁
━━━━━━━━━━━`
		
							const templateButtons = [
								{ quickReplyButton: { displayText: 'Back', id: prefix + 'alive' } }
							]
							const buttonMessage = {
								caption: startmsg,
								footer: config.FOOTER,
								templateButtons: templateButtons,
								image: { url: config.MY_LOGO }
							}
							await conn.sendMessage(from, buttonMessage)
						}
							break



				default:

					if (isowner && body.startsWith('>')) {
						try {
							await reply(util.format(await eval(`(async () => {${body.slice(1)}})()`)))
						} catch (e) {
							await reply(util.format(e))
						}
					}

			}

		} catch (e) {
			const isError = String(e)

			console.log(isError)
		}
	})
}

connectToWA()
