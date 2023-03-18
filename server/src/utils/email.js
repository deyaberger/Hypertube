require('dotenv').config()

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_URL;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
try {
	const client = mailgun.client({username: 'api', key: MAILGUN_API_KEY, url:"https://api.eu.mailgun.net"});
}
catch (e) {
	console.log("\n\nERROR IN MAILGUN SETUP MAILS WONT BE SENT\n\n")
	client = {
		messages: {
			create: async function(DOMAIN, messageData) {
				console.log("Fake MAIL", DOMAIN)
				console.log(messageData)
				return
			}
		}
	}
}
// console.log(client)


async function sendMail(dest, subject, text)
{
	console.log("sending mail: ", '\ndest: ', dest, '\nsubject: ', subject, '\ntext: ', text)
	const messageData = {
		from: 'Sekesi <sekesi@yoopster.com>',
		to: dest,
		subject: subject,
		text: text
		};
	try {
		res = await client.messages.create(DOMAIN, messageData)
	}
	catch (err) {
		console.error(err);
	};
}

module.exports = sendMail