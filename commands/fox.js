import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("fox")
	.setDescription("random fox image");
export async function execute(interaction) {
	try {
		const response = await fetch("https://randomfox.ca/floof/");

		const data = await response.json();

		await interaction.reply(`${data.image}`);
	} catch (error) {
		console.log(`Command /fox error: ${error}`);
		await interaction.reply(`Looks like something went wrong`);
	}
}
