import { registerRootComponent } from "expo";
import TrackPlayer from "react-native-track-player";

import App from "./src";

registerRootComponent(App);

TrackPlayer.registerPlaybackService(() => require("./service"));
