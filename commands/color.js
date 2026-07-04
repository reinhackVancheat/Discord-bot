import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("color")
	.setDescription("Shows the color of a hex value (#ffffff format)")
	.addStringOption((option) =>
		option
			.setName("color")
			.setDescription("The hex code to use")
			.setRequired(true),
	);
export async function execute(interaction) {
	let color = interaction.options
		.getString("color")
		.replaceAll("#", "")
		.replaceAll(" ", "");
	const hexRegex = /^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
	if (!hexRegex.test(color)) {
		await interaction.reply({
			content: "Invalid color, please use #ffffff",
			ephemeral: true,
		});
		return;
	}
	if (color.length === 3) {
		color = color
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const finalColor = `#${color.toUpperCase()}`;

	const embed = new EmbedBuilder()
		.setColor(finalColor)
		.setTitle("Your color")
		.addFields(
			{
				name: "Hex",
				value: finalColor,
				inline: true,
			},
			{
				name: "RGB",
				value: hexToRgb(color),
				inline: true,
			},
		)
		.setFooter({ text: `Requested by ${interaction.user.username}` })
		.setTimestamp();
	await interaction.reply({ embeds: [embed] });
}
function hexToRgb(hex) {
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return `${r}, ${g}, ${b}`;
}
