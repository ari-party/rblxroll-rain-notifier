import styles from "@/styles/index.module.css";
import Link from "next/link";
import Image from "next/image";
// import text from "@/styles/text.module.css";
import iconGithubMarkWhite from "@public/assets/github-mark-white.png";
import Notifier from "@/features/notifier";
import { useEffect } from "react";

export default function Index() {
	useEffect(() => {
		document.title = "Rain Notifier";
	});

	return (
		<main className={styles.main}>
			<div className={styles.content}>
				<Notifier />
				{/* <span className={text.eyebrow}>Statistics</span>
				<div className={styles.statistics}></div> */}
			</div>
			<footer className={styles.footer}>
				<Link className={styles.github} href="https://github.com/robertsspaceindustries/rblxroll-rain-notifier" target="_blank">
					Explore this site on <Image src={iconGithubMarkWhite} alt="GitHub" width={20} />
				</Link>
			</footer>
		</main>
	);
}
