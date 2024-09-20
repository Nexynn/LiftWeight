import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList, Modal, Image} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { AntDesign } from '@expo/vector-icons';

import BenchIcon from '../assets/icons/bench.png'; // Exemple d'image locale

// Liste des icônes pour les exercices
const exerciseIcons = [
  { id: 1, name: 'pushpin', type: 'antdesign' },  // Remplacer par d'autres icônes
  { id: 2, name: 'smileo' , type: 'antdesign'},
  { id: 3, name: 'rocket1', type: 'antdesign' },
  { id: 4, name: 'frowno' , type: 'antdesign'},
  { id: 5, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  // Ajouter d'autres icônes ici
];

const FirstRoute = () => {
  const [buttons, setButtons] = React.useState<{ id: number; iconId: number | null }[]>([]); // Stocke les boutons avec leur icône
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedIconId, setSelectedIconId] = React.useState<number | null>(null); // ID de l'icône sélectionnée
  

  // Fonction pour confirmer l'exercice et masquer le modal
  const confirmExercise = () => {
    if (selectedIconId) {
      setModalVisible(false);
      setButtons([...buttons, { id: buttons.length + 1, iconId: selectedIconId }]);
      setSelectedIconId(null); // Réinitialise l'icône sélectionnée après ajout
    }
  };

  // Fonction pour annuler et masquer le modal
  const cancelExercise = () => {
    setModalVisible(false); // Masque le modal sans ajouter d'exercice
    setSelectedIconId(null); // Réinitialise l'icône sélectionnée
  };
  
  // Fonction pour ajouter un nouveau bouton
  const addButtonMenu = () => {
    setModalVisible(true);
  };

  // Fonction pour sélectionner une icône
  const selectIcon = (id: number) => {
    setSelectedIconId(id);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#303030' }]}>
      <Text style={styles.date}>TODAY</Text>

      {/* ScrollView qui contient les exercices ajoutés */}
      {!modalVisible && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {buttons.map((button) => {
          const icon = exerciseIcons.find((icon) => icon.id === button.iconId); // Trouve l'icône correspondante
          return (
            <TouchableOpacity key={button.id} style={styles.button}>
              {icon && icon.type === 'antdesign' ? (
                <AntDesign name={icon.name || "plus"} size={34} color="black" style={styles.icon} />
              ) : icon && icon.iconComponent ? (
                <Image source={icon.iconComponent} style={{ width: 34, height: 34 }} />
              ) : null}
              <Text style={styles.buttonText}>Exercise {button.id}</Text>
            </TouchableOpacity>
          );
        })}

          <TouchableOpacity style={styles.button} onPress={addButtonMenu}>
            <AntDesign name="plus" size={34} color="black" style={styles.icon} />
            <Text style={styles.buttonText}>Add exercise</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal pour sélectionner l'exercice */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelExercise}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Choose the exercise</Text>

          {/* Grille des icônes d'exercice */}
          <FlatList
            data={exerciseIcons}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}  // 3 colonnes d'icônes
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.iconButton,
                  selectedIconId === item.id && styles.iconSelected,
                ]}
                onPress={() => setSelectedIconId(item.id)}
              >
                {item.type === 'antdesign' ? (
                  <AntDesign name={item.name} size={50} color="black" />
                ) : (
                  <Image source={item.iconComponent} style={{ width: 50, height: 50 }} />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.iconContainer}
          />


          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={cancelExercise}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={confirmExercise}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


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
    paddingBottom: 60,
  },
  date: {
    fontSize: 30,
    top: 40,
    color: '#fff',
    fontFamily: 'InknutAntiqua_400Regular',
    marginBottom: 70,
  },
  scrollContainer: {
    flexGrow: 1, // Permet à ScrollView d'occuper tout l'espace nécessaire
    alignItems: 'center', // Centre les éléments
  },
  button: {
    flexDirection: 'row', // Place l'icône et le texte côte à côte
    alignItems: 'center',
    justifyContent: 'center', // Centre l'icône et le texte horizontalement
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2, // Légère ombre pour effet 3D
    width: 250, // Largeur fixe du bouton (ajuster selon tes besoins)
  },
  icon: {
    marginRight: 10, // Espacement entre l'icône et le texte
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'InknutAntiqua_400Regular', // Même typographie pour le bouton
  },

  modalView: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'InknutAntiqua_400Regular',
    marginBottom: 40,
    marginTop: 20,
  },
  exerciseOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  exerciseButton: {
    backgroundColor: '#eaeaea',
    padding: 20,
    borderRadius: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  typeButton: {
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 5,
  },
  startingPoint: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  iconButton: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconSelected: {
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
