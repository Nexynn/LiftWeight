import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={[styles.container, { backgroundColor: '#303030' }]}>
    <Text style={styles.text}>Hello World</Text>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: '#303030' }]}>
    <Text style={styles.text}>Hi you</Text>
  </View>
);

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Hello' },
    { key: 'second', title: 'Hi' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
  navigationState={{ index, routes }}
  renderScene={renderScene}
  onIndexChange={setIndex}
  initialLayout={{ width: Dimensions.get('window').width }}
  renderTabBar={() => null}  // Hides the tab bar
/>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
