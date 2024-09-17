import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { AntDesign } from '@expo/vector-icons';

const FirstRoute = () => (
  <View style={[styles.container, { backgroundColor: '#303030' }]}>
    <Text style={styles.date}>TODAY</Text>

    {/* Bouton Add Exercise */}
    <TouchableOpacity style={styles.button}>
      <AntDesign name="plus" size={34} color="black" style={styles.icon} />
      <Text style={styles.buttonText}>Add exercise</Text>
    </TouchableOpacity>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: '#303030' }]}>
    <Text style={styles.date}>CHARTS</Text>
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
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={() => null} // Cache la tab bar
      />
      
      {/* Indicateur d'index */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, index === 0 ? styles.activeIndicator : null]} />
        <View style={[styles.indicator, index === 1 ? styles.activeIndicator : null]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  date: {
    fontSize: 30,
    top: 40,
    color: '#fff',
    fontFamily: 'InknutAntiqua_400Regular',
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row', // Place l'icône et le texte côte à côte
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Couleur de fond du bouton
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20, // Espacement par rapport au texte
    elevation: 2, // Légère ombre pour effet 3D
  },
  icon: {
    marginRight: 10, // Espacement entre l'icône et le texte
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'InknutAntiqua_400Regular', // Même typographie pour le bouton
  },
  indicatorContainer: {
    position: 'absolute', // Positionne l'indicateur en fonction du parent
    bottom: 20, // À 20 pixels du bas de l'écran
    width: 40, // Largeur fixée à 40 pixels
    flexDirection: 'row',
    justifyContent: 'space-between', // Espacement entre les indicateurs
    alignSelf: 'center', // Centre horizontalement l'indicateur
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    margin: 5,
  },
  activeIndicator: {
    backgroundColor: '#ccc', // La couleur de l'index actif
  },
});
