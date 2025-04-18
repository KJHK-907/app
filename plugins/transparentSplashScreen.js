"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAndroidSplashScreen = function (expoConfig) {
  return (0, config_plugins_1.withStringsXml)(expoConfig, function (modConfig) {
    modConfig.modResults = config_plugins_1.AndroidConfig.Strings.setStringItem(
      [
        {
          _: "true",
          $: {
            name: "expo_splash_screen_status_bar_translucent",
            translatable: "false",
          },
        },
      ],
      modConfig.modResults,
    );
    return modConfig;
  });
};
exports.default = withAndroidSplashScreen;
