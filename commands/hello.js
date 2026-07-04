import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("hello")
	.setDescription("Replies with Hello [username]")
	.addStringOption((option) =>
		option
			.setName("name")
			.setDescription("Name to say hello to")
			.setRequired(false),
	);
export async function execute(interaction) {
	const name = interaction.options.getString("name");
	const username = name ? name : interaction.user.globalName;
	await interaction.reply(`Hello ${username}!`);
}
