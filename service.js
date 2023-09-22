import TrackPlayer, { Event } from "react-native-track-player";

module.exports = async function () {
	TrackPlayer.addEventListener(Event.RemotePause, () => {
		TrackPlayer.pause();
	});

	TrackPlayer.addEventListener(Event.RemotePlay, async () => {
		await TrackPlayer.seekTo(-1);
		await TrackPlayer.play();
	});

	TrackPlayer.addEventListener(Event.RemoteDuck, async ({ permanent }) => {
		if (permanent) {
			TrackPlayer.pause();
		}
	});
};
