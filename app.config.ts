module.exports = {
  expo: {
    name: process.env.APP_NAME || 'foods-with-histamine',
    slug: 'foods-with-histamine',
    version: '1.0.0',
    orientation: 'portrait',
    icon: process.env.APP_ICON || './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/histamineSplash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      bundleIdentifier: 'devMars.foodsWithHistamine',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icons/ic_launcher.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/icons/favicon.ico',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '70d8c631-0855-4236-9fd3-b3ecb6ceaf45',
      },
    },
  },
};
