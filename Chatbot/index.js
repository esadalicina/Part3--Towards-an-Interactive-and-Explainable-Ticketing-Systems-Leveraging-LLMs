

import dotenv from 'dotenv';
import pkg from 'discord.js';
import { OpenAI } from 'openai';

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = pkg;

dotenv.config();

// Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,  // Needed to read message content (for newer bot features)
  ]
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Specify the channel ID where you want the button to appear
  const channelId = '1267848702651793420';  // Replace with the actual channel ID
  const channel = await client.channels.fetch(channelId);

  // Send the button message
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('create_private_chat')
        .setLabel('Start Private Chat with Bot')
        .setStyle(ButtonStyle.Primary)
    );

  // Send the message with the button to the channel
  await channel.send({
    content: 'Click the button below to start a private chat with the bot!🤖',
    components: [row],
  });
});

// Store thread timeouts
const threadTimeouts = new Map();

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return; // Check if the interaction is a button click

  if (interaction.customId === 'create_private_chat') {
    // Create a private thread in the same channel
    const threadName = `Private Chat with Bot - ${interaction.user.username}`;
    const thread = await interaction.channel.threads.create({
      name: threadName,
      autoArchiveDuration: 60, // Auto-archive after 1 hour of inactivity
      type: ChannelType.PrivateThread, // Correct type for private threads
      invitable: false, // Make it non-invitable for other users
      reason: `Private chat with bot for ${interaction.user.username}`,
    });

    // Add the user to the thread
    await thread.members.add(interaction.user.id);

    // Send a welcome message to the thread
    await thread.send(`Welcome <@${interaction.user.id}>! Feel free to ask me anything. I'm powered by OpenAI.😊`);

    // Set a timeout to close the thread after 15 minutes of inactivity
    const closeThread = () => {
      if (!thread.archived) {
        thread.send('This thread has been inactive for 15 minutes and will now be closed.').then(() => {
          thread.setArchived(true).catch(console.error);
        });
      }
      threadTimeouts.delete(thread.id);
    };

    const timeout = setTimeout(closeThread, 15 * 60 * 1000); // 15 minutes
    threadTimeouts.set(thread.id, timeout);

    // Send a response to the interaction (only visible to the user)
    await interaction.reply({
      content: `I've created a private chat for you! Join the conversation in the thread: <#${thread.id}>`,
      ephemeral: true, // Visible only to the user
    });
  }
});

// Listen to messages in the private thread to send them to OpenAI for responses
client.on('messageCreate', async message => {
  if (message.author.bot) return;  // Ignore messages from the bot itself

  if (message.channel.type === ChannelType.PrivateThread) {
    try {
      // Reset the inactivity timeout on new messages
      if (threadTimeouts.has(message.channel.id)) {
        clearTimeout(threadTimeouts.get(message.channel.id));
        const closeThread = () => {
          if (!message.channel.archived) {
            message.channel.send('This thread has been inactive for 15 minutes and will now be closed.').then(() => {
              message.channel.setArchived(true).catch(console.error);
            });
          }
          threadTimeouts.delete(message.channel.id);
        };
        const timeout = setTimeout(closeThread, 15 * 60 * 1000); // 15 minutes
        threadTimeouts.set(message.channel.id, timeout);
      }

      const userQuestion = message.content;

      // Send the user's message to OpenAI and get the response
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',  // You can use gpt-3.5-turbo or gpt-4 if you have access
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userQuestion }
        ],
      });

      // Send the OpenAI response to the thread
      await message.reply({
        content: response.choices[0].message.content,
      });
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      await message.reply({
        content: 'Sorry, I encountered an error while processing your request.😔',
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);



