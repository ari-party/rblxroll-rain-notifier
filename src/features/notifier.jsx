import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/notifier.module.css";
import { merge } from "@/utils/merge";
import text from "@/styles/text.module.css";
import Ellipsis from "@/components/ellipsis";
import Setting, { InputSwitch } from "../components/setting";
import useLocalStorage from "@robertsspaceindustries/react-localsettings";
import { io } from "socket.io-client";
import strings from "@/constants/strings";

function numberfy(amount) {
	amount = Number(amount).toFixed(2).split(".");
	amount = Number(amount[0]).toLocaleString() + "." + amount[1];
	return amount;
}

export default function Notifier() {
	const [primary, setPrimary] = useState(<Ellipsis prefix={strings.socket.connecting} />);
	const [sub, setSub] = useState(strings.socket.connectingDescription);

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
			setPrimary(strings.socket.connected);
			setSub(strings.socket.connectedDescription);
			document.title = strings.socket.title.connect;
		});

		socket.on("disconnect", () => {
			setPrimary(<Ellipsis prefix={strings.socket.reconnecting} />);
			setSub(strings.socket.reconnectingDescription);
			document.title = strings.socket.title.disconnect;
		});

		socket.on("rainRunning", function (rain) {
			if (localStorage.getItem("rain-cache") !== rain._id) {
				localStorage.setItem("rain-cache", rain._id);

				if (soundEnabled) {
					notificationSound.play();
				}

				if (notificationEnabled && !notificationBlocked) {
					new Notification(strings.socket.notification.title, { body: strings.socket.notification.body(numberfy(rain.amount)) });
				}
			}
		});

		return () => socket.disconnect();
	}, [soundEnabled, notificationEnabled, notificationBlocked]);

	return (
		<div className={styles.notifier}>
			<h1 className={merge(text.primary, text.primaryHeavy)}>{primary}</h1>
			<span className={styles.sub}>{sub}</span>
			<div className={styles.settings}>
				<span className={text.eyebrow}>Settings</span>
				<div className={styles.settingContainer}>
					<Setting name="Sound" description={strings.plugins.Sound.description}>
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
					<Setting name="Notification" description={strings.plugins.Notification.description}>
						<InputSwitch
							disabled={notificationBlocked}
							isChecked={notificationEnabled}
							onChange={useCallback(
								(e) => {
									const checked = e.target.checked;
									if (Notification.permission !== "granted") {
										Notification.requestPermission().then(() => {
											setNotificationEnabled(checked);
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
