"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const transparentNavigation = function (expoConfig) {
  return (0, config_plugins_1.withAndroidStyles)(expoConfig, function (config) {
    config.modResults = config_plugins_1.AndroidConfig.Styles.setStylesItem({
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
    config.modResults = config_plugins_1.AndroidConfig.Styles.setStylesItem({
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
    config.modResults = config_plugins_1.AndroidConfig.Styles.setStylesItem({
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
    return config;
  });
};
// withStringsXml(expoConfig, (modConfig) => {
// 	modConfig.modResults = AndroidConfig.Strings.setStringItem(
// 		[
// 			{
// 				_: "true",
// 				$: {
// 					name: "expo_splash_screen_status_bar_translucent",
// 					translatable: "false",
// 				},
// 			},
// 		],
// 		modConfig.modResults
// 	);
// 	return modConfig;
// });
exports.default = transparentNavigation;
