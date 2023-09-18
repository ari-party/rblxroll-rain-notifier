import { useEffect, useState } from "react";
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
	const [primary, setPrimary] = useState(<Ellipsis prefix={strings.socketConnecting} />);
	const [sub, setSub] = useState(strings.socketConnectingDescription);

	const [soundEnabled, setSoundEnabled] = useLocalStorage("sound", true);
	const [notificationEnabled, setNotificationEnabled] = useLocalStorage("notification", false);

	const [notificationDisabled, setNotificationDisabled] = useState(false);
	const [notificationHasPermission, setNotificationPermission] = useState(false);
	useEffect(() => {
		setNotificationDisabled(!("Notification" in window));
		setNotificationPermission(Notification.permission === "granted");
	}, [setNotificationDisabled, setNotificationPermission]);

	useEffect(() => {
		// https://notificationsounds.com/message-tones/out-of-nowhere-message-tone
		const notificationSound = new Audio("/sounds/notification.ogg");

		const socket = io("wss://api.astrid.exposed", {
			path: "/rblxroll",
			reconnection: true,
			reconnectionDelay: 1000,
		});

		socket.on("connect", () => {
			setPrimary(strings.socketConnected);
			setSub(strings.socketConnectedDescription);
			document.title = "Rain Notifier - Connected";
		});

		socket.on("disconnect", () => {
			setPrimary(<Ellipsis prefix={strings.socketReconnecting} />);
			setSub(strings.socketReconnectingDescription);
			document.title = "Rain Notifier - Reconnecting";
		});

		socket.on("rainRunning", function (rain) {
			if (localStorage.getItem("lastRain") !== rain._id) {
				localStorage.setItem("lastRain", rain._id);

				if (soundEnabled) {
					notificationSound.play();
				}

				if (notificationEnabled && notificationHasPermission) {
					new Notification("RBLXRoll: Rain Notifier", { body: `A rain of ${numberfy(rain.amount)} R$ is running` });
				}
			}
		});

		return () => socket.disconnect();
	}, [soundEnabled, notificationEnabled, notificationHasPermission]);

	return (
		<div className={styles.notifier}>
			<h1 className={merge(text.primary, text.primaryHeavy)}>{primary}</h1>
			<span className={styles.sub}>{sub}</span>
			<div className={styles.settings}>
				<span className={text.eyebrow}>Settings</span>
				<div className={styles.settingContainer}>
					<Setting name="Sound" description="Play a sound whenever a rain is running">
						<InputSwitch isChecked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
					</Setting>
					<Setting name="Notification" description="Show a notification whenever a rain is running">
						<InputSwitch
							disabled={notificationDisabled}
							isChecked={notificationDisabled ? false : notificationHasPermission ? notificationEnabled : false}
							// If the Notification api is unavailable: false, if the page doesn't have permission for notifications: false, otherwise use the setting's value
							onChange={(e) => {
								if (e.target.checked) {
									setNotificationEnabled(true);
									if (Notification.permission !== "granted") {
										Notification.requestPermission().then((result) => {
											if (result !== "granted") {
												setNotificationEnabled(false);
											}
										});
									}
								} else {
									setNotificationEnabled(e.target.checked);
								}
							}}
						/>
					</Setting>
				</div>
			</div>
		</div>
	);
}
