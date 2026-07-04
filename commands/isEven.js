import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("iseven")
	.setDescription("Says if a number is Even")
	.addIntegerOption((option) =>
		option.setName("number").setDescription("Integer number").setRequired(true),
	);
export async function execute(interaction) {
	const number = interaction.options.getInteger("number", true);
	await interaction.reply(
		number & 1 ? `${number} is not Even!` : `${number} is Even!`,
	);
}
