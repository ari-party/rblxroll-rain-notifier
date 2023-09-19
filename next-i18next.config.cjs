process.env.I18NEXT_DEFAULT_CONFIG_PATH = "next-i18next.config.cjs";
const path = require("path");

const config = {
	i18n: {
		defaultLocale: "en",
		localeDetection: true,
		locales: ["en", "nl"],
	},
	fallbackLng: {
		default: ["en"],
	},
	debug: false,
	localePath: path.resolve("./src/i18n/locales"),
	defaultNS: ["common"],
	ns: ["common"],
};

module.exports = config;
