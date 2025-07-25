const { Webhook } = require('svix');
const user = require('../models/user.js');

module.exports = async function clerkweb(req, res) {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'], // fixed typo: 'svisignature'
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: ''
                };
                await user.create(userData);
                res.json({});
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url
                };
                await user.findOneAndUpdate({ _id: data.id }, userData);
                res.json({});
                break;
            }

            case 'user.deleted': {
                await user.findOneAndDelete({ _id: data.id });
                res.json({});
                break;
            }

            default:
                res.status(204).send();
        }

    } catch (error) {
        console.log("Webhook Error:", error.message);
        res.status(400).json({ success: false, message: "Webhook handling failed." });
    }
}