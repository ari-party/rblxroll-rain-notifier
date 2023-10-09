import styles from "@/styles/index.module.css";
import Link from "next/link";
import Image from "next/image";
import iconGithubMarkWhite from "@public/assets/github-mark-white.png";
import Notifier from "@/features/notifier.jsx";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Script from "next/script";

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
			<Script async src="https://www.googletagmanager.com/gtag/js?id=G-D5N1F03L69" />
			<Script id="google-analytics">{`
			  	window.dataLayer = window.dataLayer || [];
  				function gtag(){dataLayer.push(arguments);}
  				gtag('js', new Date());

				gtag('config', 'G-D5N1F03L69');
			`}</Script>
			<Head>
				<title>{t("page_title")}</title>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={t("page_title")} />
				<meta name="og:description" content={t("page_description")} />
				<meta name="theme-color" content="#bb86fc" /> {/* globals.css' --primary */}
				<meta name="color-scheme" content="dark" />
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
