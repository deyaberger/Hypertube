require('dotenv').config()

 
const API_KEY = process.env.APIkey;
const DOMAIN = process.env.APIurl;

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY, url:"https://api.eu.mailgun.net"});
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