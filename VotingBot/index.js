import dotenv from 'dotenv';
import pkg from 'discord.js';
import { CronJob } from 'cron'; // Correct import for CronJob

dotenv.config();

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = pkg;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Needed to read message content (for newer bot features)
  ]
});

// Ensure the bot token is loaded
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Error: DISCORD_TOKEN is not defined in .env file.");
  process.exit(1); // Exit the application if no token is found
}

// Login to Discord with the bot token
client.login(token);

let votingMessageId = null; // To track the posted voting message
let weeklyTopics = ["Credit Reporting and Debt Collection", "Credit Cards and Prepaid Cards", "Bank Account or Service", "Loans", "Money Transfers and Financial Services"]; // Dynamically set by the admin

// Function to check if a user is an admin
function isAdmin(member) {
  return member.permissions.has("ADMINISTRATOR"); // Or check for a specific role ID
}

// Command to allow admins to set weekly topics
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Command format: !settopics Topic 1, Topic 2, Topic 3
  if (message.content.startsWith("!settopics")) {
    if (!isAdmin(message.member)) {
      return message.reply("❌ You don't have permission to set topics for voting.");
    }

    const topics = message.content.slice("!settopics".length).split(';').map(t => t.trim());
    if (topics.length < 2) {
      return message.reply("❌ Please provide at least 2 topics separated by commas.");
    }

    weeklyTopics = topics;
    return message.reply(`✅ Topics set for this week's voting:\n${topics.map((t, i) => `**${i + 1}.** ${t}`).join('\n')}`);
  }
});

// Weekly voting setup
const votingJob = new CronJob('03 23 * * *', async () => {
  if (weeklyTopics.length === 0) {
    console.log("No topics set for voting.");
    return;
  }

  const channel = await client.channels.fetch('1310347785249357896'); // Replace with your channel ID

   // Clear the channel before posting a new voting message
  try {
    const messages = await channel.messages.fetch({ limit: 100 }); // Fetch up to 100 messages
    await channel.bulkDelete(messages, true); // Delete messages (ignoring those older than 14 days)
  } catch (error) {
    console.error("Error clearing the channel:", error);
  }

  const votingMessage = await channel.send({
    content: `🗳️ **Weekly Support Session Voting**\n\nReact to choose a topic for this week's session:\n${weeklyTopics.map((t, i) => `**${i + 1}.** ${t}`).join('\n')}\n\nVoting ends in 24 hours!`,
  });

  // Add reactions for voting
  for (let i = 0; i < weeklyTopics.length; i++) {
    await votingMessage.react(`${i + 1}️⃣`);
  }

  votingMessageId = votingMessage.id;
});

// Restrict voting reactions to admin only
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot || reaction.message.id !== votingMessageId) return;

  const message = reaction.message;
  const member = await message.guild.members.fetch(user.id);

  if (!isAdmin(member)) {
    await reaction.users.remove(user.id); // Remove the reaction
    return member.send("❌ Only admins are allowed to react to the voting message.");
  }
});

// Determine winning topic and create thread
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot || reaction.message.id !== votingMessageId) return;

  // Fetch all reactions for the voting message
  const message = reaction.message;
  const reactions = message.reactions.cache;

  const results = new Map();
  for (const [emoji, reactionObj] of reactions) {
    results.set(emoji, reactionObj.count - 1); // Subtract 1 to exclude the bot's reaction
  }

  // Determine the winning topic
  const maxVotes = Math.max(...results.values());
  const winningEmoji = [...results.entries()].find(([, votes]) => votes === maxVotes)?.[0];
  const winningIndex = [...reactions.keys()].indexOf(winningEmoji);

  if (winningIndex === -1) return; // Invalid emoji

  const winningTopic = weeklyTopics[winningIndex];

  // Announce the result
  await message.channel.send(`🏆 The topic for this week's support session is: **${winningTopic}**`);

  // Create a thread for the winning topic
  const thread = await message.channel.threads.create({
    name: `Weekly Support - ${winningTopic}`,
    autoArchiveDuration: 60, // 24 hours
    reason: "Weekly support session thread",
  });

  await thread.send(`Welcome to this week's session on **${winningTopic}**! Feel free to discuss and ask questions.`);
});

// Start the cron job
votingJob.start();
