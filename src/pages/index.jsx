import styles from "@/styles/index.module.css";
import Link from "next/link";
import Image from "next/image";
import iconGithubMarkWhite from "@public/assets/github-mark-white.png";
import Notifier from "@/features/notifier.jsx";
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
				<title>{t("page_title")}</title>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={t("page_title")} />
				<meta name="og:description" content={t("page_description")} />
			</Head>
			<main className={styles.main}>
				<div className={styles.content}>
					<Notifier />
				</div>
				<footer className={styles.footer}>
					<Link className={styles.github} href="https://github.com/robertsspaceindustries/rblxroll-rain-notifier" target="_blank">
						{t("footer_github")} <Image src={iconGithubMarkWhite} alt="GitHub" width={20} />
					</Link>
				</footer>
			</main>
		</>
	);
}
