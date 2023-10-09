import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/notifier.module.css";
import { merge } from "@/utils/merge.js";
import text from "@/styles/text.module.css";
import Ellipsis from "@/components/ellipsis.jsx";
import Setting, { InputSwitch } from "../components/setting.jsx";
import useLocalStorage from "@robertsspaceindustries/react-localsettings";
import { io } from "socket.io-client";
import { useTranslation } from "next-i18next";
import todec from "2dec";

export default function Notifier() {
	const { t } = useTranslation();

	const [primary, setPrimary] = useState(<Ellipsis prefix={t("socketConnecting")} />);
	const [sub, setSub] = useState(t("socketConnectingDescription"));

	const [soundEnabled, setSoundEnabled] = useLocalStorage("sound", true);
	const [notificationEnabled, setNotificationEnabled] = useLocalStorage("notification", false);
	const [notificationBlocked, setNotificationBlocked] = useState(false);
	useEffect(() => {
		setNotificationBlocked(!("Notification" in window));
	}, [setNotificationBlocked]);

	useEffect(() => {
		// https://notificationsounds.com/message-tones/out-of-nowhere-message-tone
		const notificationSound = new Audio("/sounds/notification.ogg");

		const socket = io("wss://api.astrid.exposed", {
			path: "/rblxroll",
			reconnection: true,
			reconnectionDelay: 1000,
		});

		socket.on("connect", () => {
			setPrimary(t("socketConnected"));
			setSub(t("socketConnectedDescription"));
			document.title = t("pageTitleConnected");
		});

		socket.on("disconnect", () => {
			setPrimary(<Ellipsis prefix={t("socketReconnecting")} />);
			setSub(t("socketReconnectingDescription"));
			document.title = t("pageTitleReconnecting");
		});

		socket.on("rainRunning", function (rain) {
			if (localStorage.getItem("rain-cache") !== rain._id) {
				localStorage.setItem("rain-cache", rain._id);

				if (soundEnabled) {
					notificationSound.play();
				}

				if (notificationEnabled && !notificationBlocked) {
					const capitalizedRainType = rain.type.charAt(0).toUpperCase() + rain.type.slice(1);

					new Notification(t(`rain${capitalizedRainType}NotificationTitle`), {
						body: t(`rain${capitalizedRainType}NotificationBody`, {
							amount: todec(rain.amount),
							username: rain.creator?.username,
						}),
					});
				}
			}
		});

		return () => socket.disconnect();
	}, [t, soundEnabled, notificationEnabled, notificationBlocked]);

	return (
		<div className={styles.notifier}>
			<h1 className={merge(text.primary, text.primaryHeavy)}>{primary}</h1>
			<span className={styles.sub}>{sub}</span>
			<div className={styles.settings}>
				<span className={text.eyebrow}>{t("settings")}</span>
				<div className={styles.settingContainer}>
					<Setting name={t("settingsSoundName")} description={t("settingsSoundDescription")}>
						<InputSwitch
							isChecked={soundEnabled}
							onChange={useCallback(
								(e) => {
									const checked = e.target.checked;
									setSoundEnabled(checked);
								},
								[setSoundEnabled],
							)}
						/>
					</Setting>
					<Setting name={t("settingsNotificationName")} description={t("settingsNotificationDescription")}>
						<InputSwitch
							disabled={notificationBlocked}
							isChecked={notificationEnabled}
							onChange={useCallback(
								(e) => {
									const checked = e.target.checked;
									if (Notification.permission !== "granted") {
										Notification.requestPermission().then((result) => {
											if (result === "granted") {
												setNotificationEnabled(checked);
											}
										});
									} else {
										setNotificationEnabled(checked);
									}
								},
								[setNotificationEnabled],
							)}
						/>
					</Setting>
				</div>
			</div>
		</div>
	);
}
