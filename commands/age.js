import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("age")
	.setDescription("Age based on birth date")
	.addStringOption((option) =>
		option
			.setName("birth-date")
			.setDescription("Your Birth Date (DD-MM-YYYY or DD/MM/YYYY")
			.setRequired(true),
	);
export async function execute(interaction) {
	const date = interaction.options.getString("birth-date").split(/\/|-/);

	if (
		!validateDate(
			parseInt(date[0], 10),
			parseInt(date[1], 10),
			parseInt(date[2], 10),
		)
	) {
		await interaction.reply({
			content: "Invalid date, please use the correct format",
			ephemeral: true,
		});
		return;
	}
	const age = calculateAge(
		parseInt(date[0], 10),
		parseInt(date[1], 10),
		parseInt(date[2], 10),
	);
	await interaction.reply(
		`Your age is ${age.years} years ${age.months} months and ${age.days} days`,
	);
}

function validateDate(day, month, year) {
	if (month < 1 || month > 12) return false;
	if (year < 1) return false;
	if (day < 1 || day > 31) return false;

	const daysPerMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	let maxDay = daysPerMonth[month];

	if (month === 2) {
		const bissexto = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
		if (bissexto) maxDay = 29;
	}
	return day <= maxDay;
}
function calculateAge(birthDay, birthMonth, birthYear) {
	const today = new Date();
	let day = today.getDate();
	let month = today.getMonth() + 1;
	let year = today.getFullYear();

	if (day < birthDay) {
		month--;
		const lastMonthDay = new Date(year, month - 1, 0).getDate();
		day += lastMonthDay;
	}

	if (month < birthMonth) {
		year--;
		month += 12;
	}

	return {
		years: year - birthYear,
		monthes: month - birthMonth,
		days: day - birthDay,
	};
}
