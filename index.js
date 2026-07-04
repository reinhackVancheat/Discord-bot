// index.js (com ES Modules)
import fs from "node:fs";
import path from "node:path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import e from "express";

dotenv.config();

const app = e();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.send("Online!");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(`file://${filePath}`);
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	}
}

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "Error trying to use command.",
			ephemeral: true,
		});
	}
});

client.once("clientReady", () => console.log(`Bot ${client.user.tag} online!`));
client.login(process.env.DISCORD_TOKEN);
