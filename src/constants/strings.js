const strings = {
	socket: {
		connecting: "Connecting",
		connectingDescription: "We're connecting you to our socket for live notifications",
		connected: "Connected",
		connectedDescription: "You're connected to our socket, you'll be notified based on your preferences below",
		reconnecting: "Reconnecting",
		reconnectingDescription: "Connection was lost, hold on tight!",
		title: {
			connect: "Rain Notifier - Connected",
			disconnect: "Rain Notifier - Reconnecting",
		},
		notification: {
			title: "RBLXRoll: Rain Notifier",
			body: (s) => `A rain of ${s} R$ is running`,
		},
	},
	plugins: {
		Sound: {
			description: "Play a sound whenever a rain is running",
		},
		Notification: {
			description: "Show a notification whenever a rain is running",
		},
	},
};

export default strings;
