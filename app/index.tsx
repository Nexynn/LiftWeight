import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList, Modal, Image, TextInput, ActivityIndicator} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useFonts, InknutAntiqua_400Regular } from '@expo-google-fonts/inknut-antiqua';
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
  const [buttons, setButtons] = React.useState<{ id: number; iconId: number | null, mode: string, series: number, reps: number, weight: number, time: number }[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedIconId, setSelectedIconId] = React.useState<number | null>(null);
  const [selectedMode, setSelectedMode] = React.useState<string>('weighted');
  const [series, setSeries] = React.useState<number>(0);
  const [reps, setReps] = React.useState<number>(0);
  const [weight, setWeight] = React.useState<number>(0);
  const [time, setTime] = React.useState<number>(0);

  // Fonction pour confirmer l'exercice et masquer le modal
  const confirmExercise = () => {
    if (selectedIconId) {
      setModalVisible(false);
      setButtons([...buttons, {
        id: buttons.length + 1,
        iconId: selectedIconId,
        mode: selectedMode,
        series: series,
        reps: reps,
        weight: weight,
        time: time,
      }]);
      setSelectedIconId(null);
      resetModalInputs();
    }
  };

  // Fonction pour réinitialiser les champs du modal
  const resetModalInputs = () => {
    setSelectedIconId(null);
    setSelectedMode('weighted');
    setSeries(0);
    setReps(0);
    setWeight(0);
    setTime(0);
  };

  const cancelExercise = () => {
    setModalVisible(false);
    resetModalInputs();
  };

  const addButtonMenu = () => {
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#303030' }]}>
      <Text style={styles.date}>TODAY</Text>

      {!modalVisible && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {buttons.map((button) => {
          const icon = exerciseIcons.find((icon) => icon.id === button.iconId);
          return (
            <TouchableOpacity key={button.id} style={styles.button}>
              {icon && icon.type === 'antdesign' ? (
                <AntDesign name={icon.name || "plus"} size={34} color="black" style={styles.icon} />
              ) : icon && icon.iconComponent ? (
                <Image source={icon.iconComponent} style={{ width: 34, height: 34 }} />
              ) : null}
              
              {/* Nom de l'exercice */}
              <Text style={styles.buttonText}>Exercise {button.id}</Text>
      
              {/* Affichage des détails en fonction du mode */}
              {button.mode === 'weighted' && (
                <Text style={styles.exerciseDetails}>
                  {button.series} Series x {button.reps} Reps - {button.weight} kg
                </Text>
              )}
              {button.mode === 'timed' && (
                <Text style={styles.exerciseDetails}>
                  {button.series} Series - {button.time} sec
                </Text>
              )}
              {button.mode === 'body' && (
                <Text style={styles.exerciseDetails}>
                  Bodyweight Exercise
                </Text>
              )}
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

          <FlatList
            data={exerciseIcons}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.iconButton, selectedIconId === item.id && styles.iconSelected]}
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

          {/* Sélection du mode */}
          <View style={styles.typeButtons}>
            <TouchableOpacity onPress={() => setSelectedMode('weighted')} style={selectedMode === 'weighted' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Weighted</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMode('timed')} style={selectedMode === 'timed' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Timed</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMode('body')} style={selectedMode === 'body' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Body</Text>
            </TouchableOpacity>
          </View>

          {/* Affichage des champs en fonction du mode sélectionné */}
          {selectedMode === 'weighted' && (
            <View>
              <TextInput placeholder="Series" keyboardType="numeric" value={series.toString()} onChangeText={(text) => setSeries(Number(text))} style={styles.input} />
              <TextInput placeholder="Reps" keyboardType="numeric" value={reps.toString()} onChangeText={(text) => setReps(Number(text))} style={styles.input} />
              <TextInput placeholder="Weight (kg)" keyboardType="numeric" value={weight.toString()} onChangeText={(text) => setWeight(Number(text))} style={styles.input} />
            </View>
          )}
          {selectedMode === 'timed' && (
            <View>
              <TextInput placeholder="Series" keyboardType="numeric" value={series.toString()} onChangeText={(text) => setSeries(Number(text))} style={styles.input} />
              <TextInput placeholder="Time (seconds)" keyboardType="numeric" value={time.toString()} onChangeText={(text) => setTime(Number(text))} style={styles.input} />
            </View>
          )}

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
  const [fontsLoaded] = useFonts({
    InknutAntiqua_400Regular,
  });

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
    marginBottom: 50,
  },
  scrollContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.7, // Pour prendre environ 90% de la largeur de l'écran
    alignItems: 'center',
  },
  icon: {
    marginRight: 10, // Espacement entre l'icône et le texte
  },
  buttonText: {
    fontSize: 21,
    fontFamily: 'InknutAntiqua_400Regular', // Même typographie pour le bouton
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#333',
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
  inputContainer: {
    marginTop: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  selectedType: {
    backgroundColor: '#ccc',
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
