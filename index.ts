import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';

// React Navigation の準備を整える
// これにより、画面名に関する問題を軽減できる可能性があります
enableScreens();

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
