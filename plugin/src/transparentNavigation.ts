import type { ConfigPlugin } from "@expo/config-plugins";
import { AndroidConfig, withAndroidStyles } from "@expo/config-plugins";

const transparentNavigation: ConfigPlugin = (expoConfig) =>
	withAndroidStyles(expoConfig, (config) => {
		config.modResults = AndroidConfig.Styles.setStylesItem({
			parent: {
				name: "AppTheme",
				parent: "Theme.AppCompat.Light.NoActionBar",
			},
			item: {
				_: "@android:color/transparent",
				$: {
					name: "android:navigationBarColor",
				},
			},
			xml: config.modResults,
		});

		config.modResults = AndroidConfig.Styles.setStylesItem({
			parent: {
				name: "AppTheme",
				parent: "Theme.AppCompat.Light.NoActionBar",
			},
			item: {
				_: "@android:color/transparent",
				$: {
					name: "android:statusBarColor",
				},
			},
			xml: config.modResults,
		});

		config.modResults = AndroidConfig.Styles.setStylesItem({
			parent: {
				name: "AppTheme",
				parent: "Theme.AppCompat.Light.NoActionBar",
			},
			item: {
				_: "false",
				$: {
					name: "android:enforceNavigationBarContrast",
				},
			},
			xml: config.modResults,
		});

		config.modResults = AndroidConfig.Styles.setStylesItem({
			parent: {
				name: "AppTheme",
				parent: "Theme.AppCompat.Light.NoActionBar",
			},
			item: {
				_: "false",
				$: {
					name: "android:enforceStatusBarContrast",
				},
			},
			xml: config.modResults,
		});

		return config;
	});

export default transparentNavigation;
