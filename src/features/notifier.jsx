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

	const [primary, setPrimary] = useState(<Ellipsis prefix={t("socket_connecting")} />);
	const [sub, setSub] = useState(t("socket_connecting_description"));

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
			setPrimary(t("socket_connected"));
			setSub(t("socket_connected_description"));
			document.title = t("page_title_connected");
		});

		socket.on("disconnect", () => {
			setPrimary(<Ellipsis prefix={t("socket_reconnecting")} />);
			setSub(t("socket_reconnecting_description"));
			document.title = t("page_title_reconnecting");
		});

		socket.on("rainRunning", (rain) => {
			if (localStorage.getItem("rain-cache") !== rain._id) {
				localStorage.setItem("rain-cache", rain._id);

				if (soundEnabled) {
					notificationSound.play();
				}

				if (notificationEnabled && !notificationBlocked) {
					new Notification(t(`rain_${rain.type}_notification_title`), {
						body: t(`rain_${rain.type}_notification_body`, {
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
					<Setting name={t("settings_sound_name")} description={t("settings_sound_description")}>
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
					<Setting name={t("settings_notification_name")} description={t("settings_notification_description")}>
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
