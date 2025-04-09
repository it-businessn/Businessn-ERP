// versionCheck.js
let currentVersion = null;

export async function checkVersionPeriodically() {
	setInterval(async () => {
		try {
			const res = await fetch("/version.json", { cache: "no-cache" });
			const data = await res.json();
			if (!currentVersion) {
				currentVersion = data.version;
			} else if (data.version !== currentVersion) {
				console.log("🆕 New version detected! Reloading...");
				window.location.reload(true);
			}
		} catch (err) {
			console.error("Version check failed", err);
		}
	}, 60000);
}
