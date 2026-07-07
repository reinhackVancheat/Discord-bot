import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("dog")
	.setDescription("random dog image");
export async function execute(interaction) {
	try {
		const response = await fetch(
			"https://random.dog/woof.json?ref=apilist.fun",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		const jsonData = await response.json();
		await interaction.reply(`${jsonData.url}`);
	} catch (err) {
		console.log(`Command /dog error: ${err}`);
		await interaction.reply(`Looks like something went wrong`);
	}
}
