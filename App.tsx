import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import './src/config/i18n';
import Toast from 'react-native-toast-message';
import {getToastConfig} from './src/config/toastConfig';
import {useThemeStore} from './src/config/theme';

function App(): React.JSX.Element {
  const isDark = useThemeStore(s => s.isDark);

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <Toast config={getToastConfig(isDark)} />
    </SafeAreaProvider>
  );
}

export default App;
