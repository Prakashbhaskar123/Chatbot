const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const token = '7697793121:AAFlG-berLmnnnVCSNr9sAgsQzaqpstpiA0';
const bot = new TelegramBot(token, { polling: true });

// Listen for messages from the user
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text.toLowerCase();  // Get the user's input

    // Check if the user just started the conversation or sent a basic greeting
    if (userMessage === '/start' || userMessage === 'hi' || userMessage === 'hello') {
        bot.sendMessage(chatId, 'Welcome! Please enter a gender (male or female) to get a random user:');
    } else {
        // Check if the input is valid (either 'male' or 'female')
        const gender = userMessage.trim().toLowerCase();

        if (gender === 'male' || gender === 'female') {
            // Construct the Random User API URL based on the user's input (gender)
            const url = `https://randomuser.me/api/?gender=${gender}`;

            // Make the API request
            request(url, (err, res, body) => {
                if (err) {
                    bot.sendMessage(chatId, "Error while fetching random user data. Please try again later.");
                    console.error("Error:", err);
                } else {
                    const data = JSON.parse(body); // Parse the JSON response
                    const user = data.results[0];  // Get the first random user
                    const name = `${user.name.first} ${user.name.last}`;
                    const gender = user.gender;
                    const email = user.email;
                    const location = `${user.location.city}, ${user.location.country}`;
                    const phone = user.phone;
                    const picture = user.picture.large;

                    // Send the extracted data as a message
                    bot.sendMessage(chatId, `Name: ${name}`);
                    bot.sendMessage(chatId, `Gender: ${gender}`);
                    bot.sendMessage(chatId, `Email: ${email}`);
                    bot.sendMessage(chatId, `Location: ${location}`);
                    bot.sendMessage(chatId, `Phone: ${phone}`);
                    bot.sendPhoto(chatId, picture); // Send the user's profile picture
                }
            });
        } else {
            // If the user enters an invalid gender, ask them to input a valid one
            bot.sendMessage(chatId, "Invalid input. Please enter 'male' or 'female' to get a random user.");
        }
    }
});
