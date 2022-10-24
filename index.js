
const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType ,
	jidDecode
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { state, saveState } = useSingleFileAuthState('./session.json')
const config = require('./config')
const prefix = '.'
const owner = ['94766866297']
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
	
	conn.ev.on('messages.upsert', async(mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return
			
			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			
			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : ( type == 'listResponseMessage') && mek.message.listResponseMessage.singleSelectReply.selectedRowId? mek.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId  ? mek.message.buttonsResponseMessage.selectedButtonId  : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId  :  (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
			
		
			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
			
			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
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

				case 'start': case 'alive': case 'sir': case 'Start': case 'Alive': {

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
								{ title: "☞︎︎︎  Group වලට Links ලබා ගැනීමට", rowId: "glinks" },
								{ title: "☞︎︎︎  පංති ගාස්තු පිලිබද විස්තර", rowId: "cfees" },
								{ title: "☞︎︎︎  පංති කාලසටහන", rowId: "ctable" },
								{ title: "☞︎︎︎  නිබන්ධන ලබා ගන්නා ආකාරය", rowId: "tutesget" },
								{ title: "☞︎︎︎  මගහැරුන පාඩම් ලබා ගැනීමට", rowId: "prevless" },
								{ title: "☞︎︎︎  තුෂාන් ධර්මේන්ද්‍ර සර් ගැන", rowId: "aboutsir" }
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
					await conn.sendMessage(from, { image: {url: 'https://telegra.ph/file/8b8d49a533ae75d867f59.jpg'} } ),
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
						{ urlButton: { displayText: config.URL_WEBSITE, url: config.URL_WEBLINK } },
						{ urlButton: { displayText: config.URL_YOUTUBE, url: config.URL_YTLINK } },
						{ quickReplyButton: { displayText: 'Start', id: prefix + 'start' } },
						{ quickReplyButton: { displayText: 'Menu', id: prefix + 'promenu' } }
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

				case 'creg': {

					const startmsg = `
🔰 ඔබට සහභාගීවීමට අවශ්‍ය පන්තිය පහත *'View Class'* භාවිත කර තෝරාගන්න.
	
🍁 Thank You 🍁
━━━━━━━━━━━`

					const sections = [
						{
							title: "🍁 තුෂාන් ධර්මේන්ද්‍ර Online Accounting 🍁",
							rows: [
								{ title: "A/L 2024 Theory", rowId: prefix + 'reg24th', description: "Accounting" },
								{ title: "A/L 2023 Revision", rowId: "reg23re", description: "Accounting" },
								{ title: "O/L Commerce Grade-10", rowId: "regcomg10", description: "SINHALA MEDIUM" },
								{ title: "O/L Commerce Grade-11", rowId: "regcomg11", description: "SINHALA MEDIUM" },
								{ title: "IABF Accounting", rowId: "regiabf", description: "IBSL Bank Exam" }
							]
						}
					]
					const listMessage = {
						text: startmsg,
						footer: config.TVFOOTER,
						title: "🍁 පන්තියට ලියාපදිංචි වීමට 🍁",
						buttonText: "View Class",
						sections
					}
					await conn.sendMessage(from, listMessage)
				}
					break

				//......................................................Group Links..............................................................\\

				case 'glinks': {

					const startmsg = `
🔰 ඔබට සහභාගීවීමට අවශ්‍ය පන්තියට අදාල Group එක පහත *'View Group'* භාවිත කර තෝරාගන්න.
	
🍁 Thank You 🍁
━━━━━━━━━━━`

					const sections = [
						{
							title: "🍁 තුෂාන් ධර්මේන්ද්‍ර Online Accounting 🍁",
							rows: [
								{ title: "A/L 2024 Theory", rowId: prefix + 'gl24th', description: "Accounting" },
								{ title: "A/L 2023 Revision", rowId: "gl23re", description: "Accounting" },
								{ title: "O/L Commerce Grade-10", rowId: "glcomg10", description: "Commerce" },
								{ title: "O/L Commerce Grade-11", rowId: "glcomg11", description: "Commerce" },
								{ title: "IABF Accounting", rowId: "gliabf", description: "IBSL Bank Exam" }
							]
						}
					]
					const listMessage = {
						text: startmsg,
						footer: config.TVFOOTER,
						title: "🍁 Group වලට Links ලබා ගැනීමට 🍁",
						buttonText: "View Group",
						sections
					}
					await conn.sendMessage(from, listMessage)
				}
					break

				case 'gl24th': {

					const startmsg = `*🍁 A/L 2024 Theory Accounting 🍁*
	
						🔰 WhatsApp Group
							۞ 

						🔰 Telegram Channel
							۞
	`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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

				case 'gl23re': {

					const startmsg = `*🍁 A/L 2023 Revision Accounting 🍁*
		
							🔰 WhatsApp Group
								۞ 
	
							🔰 Telegram Channel
								۞
		`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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

				case 'glcomg10': {

					const startmsg = `*🍁 O/L Commerce Grade - 10 🍁*
			
								🔰 WhatsApp Group
									۞ 
		
								🔰 Telegram Channel
									۞
			`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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

				case 'glcomg11': {

					const startmsg = `*🍁 O/L Commerce Grade - 11 🍁*
				
									🔰 WhatsApp Group
										۞ 
			
									🔰 Telegram Channel
										۞
				`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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

				case 'gliabf': {

					const startmsg = `*🍁 IABF Accounting 🍁*
					
										🔰 WhatsApp Group
											۞ 
				
										🔰 Telegram Channel
											۞
					`

					const templateButtons = [
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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
						{ quickReplyButton: { displayText: 'Back', id: prefix + 'start' } }
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
						} catch(e) {
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
