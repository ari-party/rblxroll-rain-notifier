import styles from "@/styles/index.module.css";
import Link from "next/link";
import Image from "next/image";
// import text from "@/styles/text.module.css";
import iconGithubMarkWhite from "@public/assets/github-mark-white.png";
import Notifier from "@/features/notifier";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
		},
	};
}

export default function Index() {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{t("pageTitle")}</title>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={t("pageTitle")} />
				<meta name="og:description" content={t("pageDescription")} />
			</Head>
			<main className={styles.main}>
				<div className={styles.content}>
					<Notifier />
					{/* <span className={text.eyebrow}>Statistics</span>
				<div className={styles.statistics}></div> */}
				</div>
				<footer className={styles.footer}>
					<Link className={styles.github} href="https://github.com/robertsspaceindustries/rblxroll-rain-notifier" target="_blank">
						{t("footerGithub")} <Image src={iconGithubMarkWhite} alt="GitHub" width={20} />
					</Link>
				</footer>
			</main>
		</>
	);
}
