import { execFile } from "child_process";
import { SlashCommandBuilder } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = new SlashCommandBuilder()
	.setName("ascii_text")
	.setDescription("Shows a text in ASCII art format")
	.addStringOption((option) =>
		option
			.setName("text")
			.setDescription(
				"Your text here (Maximum 8 chars - Discord's bad rendering)",
			)
			.setRequired(true),
	);

export async function execute(interaction) {
	const text = interaction.options.getString("text", true);
	if (text.length > 8) {
		await interaction.reply("Error: maximum chars is 8");
		return;
	}
	const binPath = path.join(
		__dirname,
		"..",
		"modules",
		"bin",
		"ascii_translate",
	);
	const fontPath = path.join(__dirname, "..", "modules", "font.flf");

	await interaction.deferReply();

	execFile(binPath, [fontPath, text], async (err, stdout, stderr) => {
		if (err) {
			console.error("Error executing binary:", err);
			await interaction.editReply(
				"Something went wrong while generating the ASCII art.",
			);
			return;
		}

		let output = stdout.replace(/\x1b\[2J\x1b\[H/g, "");
		const lines = output.split("\n");
		lines.pop();
		output = lines.join("\n").trim();

		if (output.length > 2000) {
			const buffer = Buffer.from(output, "utf-8");
			await interaction.editReply({
				files: [
					{
						attachment: buffer,
						name: "ascii_art.txt",
					},
				],
			});
		} else {
			await interaction.editReply(`\`\`\`\n${output}\n\`\`\``);
		}
	});
}
