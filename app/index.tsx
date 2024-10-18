import * as React from 'react';
import { Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, ScrollView, Dimensions, Pressable, FlatList, Modal, Image, TextInput, ActivityIndicator} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useFonts } from 'expo-font';


import BenchIcon from '../assets/icons/bench.png'; // Exemple d'image locale

// Liste des icônes pour les exercices
const exerciseIcons = [
  //{ id: 1, name: 'pushpin', type: 'antdesign' },  // Remplacer par d'autres icônes
  { id: 1, name: 'pushpin', type: 'antdesign' },  // Remplacer par d'autres icônes
  { id: 2, name: 'smileo' , type: 'antdesign'},
  { id: 3, name: 'rocket1', type: 'antdesign' },
  { id: 4, name: 'frowno' , type: 'antdesign'},
  { id: 5, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  { id: 6, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  { id: 7, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  { id: 8, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  { id: 9, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  { id: 10, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  { id: 11, name: 'bench', iconComponent: BenchIcon, type: 'custom'},  // Icône personnalisée
  // Ajouter d'autres icônes ici
];


const MainRoute = () => {
  const [date, setDate] = React.useState(new Date());

  const [presetName, setPresetName] = React.useState<string>('');
  const [presets, setPresets] = React.useState<{ name: string; buttons: any[] }[]>([{ name: 'Clear', buttons: [] }]);
  const [createModalVisible, setCreateModalVisible] = React.useState(false);
  const [selectModalVisible, setSelectModalVisible] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);

  const [buttons, setButtons] = React.useState<{ id: number; exerciseName: string, iconId: number | null, mode: string, equipment: string, sets: number, reps: number, weight: number, time: number }[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedIconId, setSelectedIconId] = React.useState<number | null>(null);
  const [selectedMode, setSelectedMode] = React.useState<string>('weighted');
  const [equipmentChoice, setEquipmentChoice] = React.useState<string>('barbell');
  const [sets, setSets] = React.useState<number>(0);
  const [reps, setReps] = React.useState<number>(0);
  const [weight, setWeight] = React.useState<number>(0);
  const [time, setTime] = React.useState<number>(0);

  const [exerciseName, setExerciseName] = React.useState('');
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [realReps, setRealReps] = React.useState<number[]>([]);
  const [realWeight, setRealWeight] = React.useState<number[]>([]);

  React.useEffect(() => {
    // Récupérer les données de la date actuelle au chargement
    retrieveDataForDate(formatDateKey(date));
    retrievePresets();
  }, []);

  // Ouvrir le modal pour un exercice spécifique
  const openExerciseModal = (exercise: { id: number; exerciseName: string; sets: number; reps: number; weight: number; realReps?: number[]; realWeight?: number[] }) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.exerciseName);
    setSets(exercise.sets);
    setReps(exercise.reps);
    setWeight(exercise.weight);
    setRealReps(exercise.realReps ? exercise.realReps : new Array(exercise.sets).fill(0));
    setRealWeight(exercise.realWeight ? exercise.realWeight : new Array(exercise.sets).fill(0));
    setEditModalVisible(true);
  };

  // Sauvegarder les modifications de l'exercice
  const saveExerciseChanges = () => {
    const updatedButtons = buttons.map((btn) =>
      btn.id === selectedExercise.id
        ? { ...btn, exerciseName, sets, reps, weight, realReps, realWeight }
        : btn
    );
    setButtons(updatedButtons);
    setEditModalVisible(false);
    resetEditModalInputs();
  };

  // Supprimer l'exercice
  const deleteExercise = () => {
    const updatedButtons = buttons.filter((btn) => btn.id !== selectedExercise.id);
    setButtons(updatedButtons);
    setEditModalVisible(false);
    resetEditModalInputs();
  };

  // Fonction pour réinitialiser les champs du modal
  const resetEditModalInputs = () => {
    setExerciseName('');
    setSets(0);
    setReps(0);
    setWeight(0);
    setRealReps([]);
    setRealWeight([]);
  };

  // Formater la date en clé pour sauvegarde ("YYYY-MM-DD")
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]; // Format "YYYY-MM-DD"
  };

  // Sauvegarder les données pour une date spécifique dans AsyncStorage
  const saveDataForDate = async (dateKey, savedButtons) => {
    try {
      await AsyncStorage.setItem(dateKey, JSON.stringify(savedButtons));
      console.log(`Données sauvegardées pour la date : ${dateKey}`);
    } catch (error) {
      console.log('Erreur lors de la sauvegarde des données', error);
    }
  };

  // Récupérer les données pour une date spécifique
  const retrieveDataForDate = async (dateKey) => {
    try {
      const storedButtons = await AsyncStorage.getItem(dateKey);
      
      if (storedButtons) {
        setButtons(JSON.parse(storedButtons));
      } else {
        setButtons([]); // Si pas de données pour cette date, réinitialiser
      }
      
      console.log(`Données récupérées pour la date : ${dateKey}`);
    } catch (error) {
      console.log('Erreur lors de la récupération des données', error);
    }
  };

  // Sauvegarder les préréglages (presets) dans AsyncStorage
  const savePresets = async (newPresets) => {
    try {
      await AsyncStorage.setItem('presets', JSON.stringify(newPresets));
      console.log('Presets sauvegardés');
    } catch (error) {
      console.log('Erreur lors de la sauvegarde des presets', error);
    }
  };

  // Récupérer les préréglages (presets) depuis AsyncStorage
  const retrievePresets = async () => {
    try {
      const storedPresets = await AsyncStorage.getItem('presets');
      if (storedPresets) {
        setPresets(JSON.parse(storedPresets));
      } else {
        setPresets([{ name: 'Clear', buttons: [] }]); // Par défaut si pas de presets sauvegardés
      }
      console.log('Presets récupérés');
    } catch (error) {
      console.log('Erreur lors de la récupération des presets', error);
    }
  };

  // Fonction pour formater la date (tu peux adapter le format comme tu veux)
  const formatDate = (date: Date) => {
    const today = new Date();
    
    // Vérifier si la date passée correspond à aujourd'hui
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    return date.toDateString(); // Exemple : 'Wed Oct 04 2024'
  };

  // Fonction pour changer la date
  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
    retrieveDataForDate(formatDateKey(newDate)); // Récupérer les données de la nouvelle date
  };

  // Fonction pour enregistrer un preset
  const savePreset = () => {
    const newPreset = { name: presetName, buttons: buttons }; // Utiliser le nom et les boutons actuels
    const updatedPresets = [...presets, newPreset]; // Ajouter le nouveau preset à la liste
    setPresets(updatedPresets); // Mettre à jour l'état
    savePresets(updatedPresets); // Sauvegarder les presets dans AsyncStorage
    setCreateModalVisible(false); // Fermer le modal de création
    setPresetName(''); // Réinitialiser le nom du preset
  };

  // Fonction pour sélectionner un preset
  const selectPreset = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName);
    
    if (preset) {
      setButtons(preset.buttons); // Restaurer les boutons du preset sélectionné
      setSelectedPreset(preset.name); // Mettre à jour le preset sélectionné
      setSelectModalVisible(false); // Fermer le modal
    }
    saveDataForDate(formatDateKey(date), preset?.buttons || []); // Sauvegarder les boutons pour la date actuelle
  };


  // Fonction pour confirmer l'exercice et masquer le modal
  const confirmExercise = () => {
    if (selectedIconId) {
      setModalVisible(false);
      
      // Mettre à jour la liste des boutons avec le nouvel exercice
      const newButtons = [...buttons, {
        id: buttons.length + 1,
        iconId: selectedIconId,
        mode: selectedMode,
        equipment: equipmentChoice,
        sets: sets,
        reps: reps,
        weight: weight,
        time: time,
        realReps: new Array(sets).fill(0),
        realWeight: new Array(sets).fill(0),
        exerciseName: `Exercise ${buttons.length + 1}`,
      }];
      
      // Met à jour l'état buttons et ensuite sauvegarde les données
      setButtons(newButtons);
      
      // Sauvegarder les boutons pour la date actuelle une fois l'état mis à jour
      saveDataForDate(formatDateKey(date), newButtons);

      setSelectedIconId(null);
      resetModalInputs();
    }
  };

  // Fonction pour réinitialiser les champs du modal
  const resetModalInputs = () => {
    setSelectedIconId(null);
    setSelectedMode('weighted');
    setEquipmentChoice('barbell');
    setSets(0);
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

  // Fonction pour supprimer un preset
  const deletePreset = (presetName: string) => {
    setPresets(presets.filter((preset) => preset.name !== presetName));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={[styles.container, { backgroundColor: '#303030' }]}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50, marginBottom: 20 }}>
        {/* Chevron gauche pour diminuer la date */}
        <Pressable 
          onPress={() => changeDate(-1)} 
          style={{ position: 'absolute', transform: [{ translateX: -120 }] }}
        >
          <AntDesign name="left" size={24} color="white" />
        </Pressable>

        {/* Affichage de la date */}
        <Text style={styles.date}>{formatDate(date)}</Text>

        {/* Chevron droit pour augmenter la date */}
        <Pressable 
          onPress={() => changeDate(1)} 
          style={{ position: 'absolute', transform: [{ translateX: 120 }] }}
        >
          <AntDesign name="right" size={24} color="white" />
        </Pressable>
      </View>



      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Pressable style={styles.iconButtonPreset} onPress={() => setCreateModalVisible(true)}>
          <AntDesign name="plus" size={20} color="black" />
          <Text style={styles.iconLabel}>Create Preset</Text>
        </Pressable>

        <Pressable style={styles.iconButtonPreset} onPress={() => setSelectModalVisible(true)}>
          <AntDesign name="bars" size={20} color="black" />
          <Text style={styles.iconLabel}>Choose Preset</Text>
        </Pressable>
      </View>

    


      {!modalVisible && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {buttons.map((button) => {
          const icon = exerciseIcons.find((icon) => icon.id === button.iconId);
          return (
            <Pressable key={button.id} style={styles.button} onPress={() => openExerciseModal(button)}>
              {icon && icon.type === 'antdesign' ? (
                <AntDesign name={icon.name || "plus"} size={30} color="black" style={styles.icon} />
              ) : icon && icon.iconComponent ? (
                <Image source={icon.iconComponent} style={{ width: 25, height: 25 }} />
              ) : null}
              
              {/* Nom de l'exercice */}
              <Text style={styles.buttonText}>{button.exerciseName}</Text>
      
              {/* Affichage des détails en fonction du mode */}
              {button.mode === 'weighted' && (
                <Text style={styles.exerciseDetails}>
                  {button.sets} Sets ({button.equipment})
                </Text>
              )}
              {button.mode === 'timed' && (
                <Text style={styles.exerciseDetails}>
                  {button.sets} Sets ({button.equipment})
                </Text>
              )}
              {button.mode === 'body' && (
                <Text style={styles.exerciseDetails}>
                  {button.sets} Sets
                </Text>
              )}
            </Pressable>
          );
        })}
      
        <Pressable style={styles.button} onPress={addButtonMenu}>
          <AntDesign name="plus" size={34} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Add exercise</Text>
        </Pressable>
      </ScrollView>
      )}


    {/* Modals Create et Select Preset côte à côte */} 
    <Modal visible={createModalVisible || selectModalVisible} animationType="slide" transparent={true}>
      <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-around' }]}>
    
        {/* Modal pour créer un preset */}
        {createModalVisible && (
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create a Preset</Text>
            <TextInput
              placeholder="Preset Title"
              value={presetName}
              onChangeText={setPresetName}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setCreateModalVisible(false)}>
                <Text>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={savePreset}>
                <Text>Save</Text>
              </Pressable>
            </View>
          </View>
        )}

       {/* Modal pour sélectionner un preset */}
        {selectModalVisible && (
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select a Preset</Text>
            <FlatList
              data={presets}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View style={styles.presetItemContainer}>
                  <Pressable style={styles.presetItem} onPress={() => selectPreset(item.name)}>
                    <Text style={styles.presetText}>{item.name}</Text>
                  </Pressable>
                  {/* Afficher le bouton de suppression uniquement si ce n'est pas le preset "Clear" */}
                  {item.name !== 'Clear' && (
                    <Pressable onPress={() => deletePreset(item.name)} style={styles.deleteButton}>
                      <AntDesign name="delete" size={24} color="red" />
                    </Pressable>
                  )}
                </View>
              )}
            />
            <Pressable style={styles.modalButtonClosePreset} onPress={() => setSelectModalVisible(false)}>
              <Text>Close</Text>
            </Pressable>
          </View>
        )}

      </View>
    </Modal>


    {/* Modal pour modifier un exercice */}
    <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Exercise</Text>
            
          <TextInput
              placeholder="Exercise Name"
              value={exerciseName}
              onChangeText={setExerciseName}
              style={styles.input}
            />

          <View style={styles.editSetButton}>
          <TextInput
              placeholder="Sets"
              keyboardType="numeric"
              value={sets.toString()}
              onChangeText={(value) => setSets(Number(value))}
              style={styles.input}
            />

            <Text>X</Text>
            <TextInput
              placeholder="Reps"
              keyboardType="numeric"
              value={reps.toString()}
              onChangeText={(value) => setReps(Number(value))}
              style={styles.input}
            />

            <Text>X</Text>
            <TextInput
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={weight.toString()}
              onChangeText={(value) => setWeight(Number(value))}
              style={styles.input}
            />
          </View>

          {/* Réel nombre de reps et poids */}
          {Array.from({ length: sets }, (_, index) => (
            <View key={index} style={styles.editSetButton}>
              <Text>Set {index + 1}</Text>
              <TextInput
                placeholder="Real Reps"
                keyboardType="numeric"
                value={realReps[index] ? realReps[index].toString() : ''} // Vérifie que l'index existe
                onChangeText={(value) => {
                  const newReps = [...realReps];
                  const parsedValue = parseInt(value);
                  newReps[index] = isNaN(parsedValue) ? 0 : parsedValue; // Validation de l'entrée
                  setRealReps(newReps);
                }}
                style={styles.input}
              />
              <Text>X</Text>
              <TextInput
                placeholder="Real Weight"
                keyboardType="numeric"
                value={realWeight[index] ? realWeight[index].toString() : ''} // Vérifie que l'index existe
                onChangeText={(value) => {
                  const newWeights = [...realWeight];
                  const parsedValue = parseInt(value);
                  newWeights[index] = isNaN(parsedValue) ? 0 : parsedValue; // Validation de l'entrée
                  setRealWeight(newWeights);
                }}
                style={styles.input}
              />
            </View>
          ))}

          <View style={styles.exerciseOptions}>
            <Pressable style={styles.modalButton} onPress={saveExerciseChanges}>
              <Text>Save</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={deleteExercise}>
              <Text>Delete</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => {setEditModalVisible(false); resetEditModalInputs()}}>
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


    {/* Modal pour sélectionner l'exercice */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={cancelExercise}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Choose the exercise</Text>

        <View style={{ height: 300 }}>
          <FlatList
            data={exerciseIcons}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.iconButton, selectedIconId === item.id && styles.iconSelected]}
                onPress={() => setSelectedIconId(item.id)}
              >
                {item.type === 'antdesign' ? (
                  <AntDesign name={item.name} size={50} color="black" />
                ) : (
                  <Image source={item.iconComponent} style={{ width: 50, height: 50 }} />
                )}
              </Pressable>
            )}
            contentContainerStyle={styles.iconContainer}
            scrollEnabled={true}
          />
        </View>

        {/* Sélection du mode */}
        <View style={styles.typeButtons}>
          <Pressable onPress={() => setSelectedMode('weighted')} style={selectedMode === 'weighted' ? styles.typeButtonActive : styles.typeButton}>
            <Text>Weighted</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedMode('timed')} style={selectedMode === 'timed' ? styles.typeButtonActive : styles.typeButton}>
            <Text>Timed</Text>
          </Pressable>
          <Pressable onPress={() => setSelectedMode('body')} style={selectedMode === 'body' ? styles.typeButtonActive : styles.typeButton}>
            <Text>Body</Text>
          </Pressable>
        </View>

        {(selectedMode === 'weighted' || selectedMode === 'timed') && (
          <View style={styles.typeButtons}>
          <Pressable onPress={() => setEquipmentChoice('barbell')} style={equipmentChoice === 'barbell' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Barbell</Text>
            </Pressable>
            <Pressable onPress={() => setEquipmentChoice('dumbbell')} style={equipmentChoice === 'dumbbell' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Dumbbell</Text>
            </Pressable>
            <Pressable onPress={() => setEquipmentChoice('machine')} style={equipmentChoice === 'machine' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Machine</Text>
            </Pressable>
            <Pressable onPress={() => setEquipmentChoice('plate')} style={equipmentChoice === 'plate' ? styles.typeButtonActive : styles.typeButton}>
              <Text>Plate</Text>
            </Pressable>
          </View>)}


        {/* Affichage des champs en fonction du mode sélectionné */}
        {selectedMode === 'weighted' && (
          <View style={styles.editSetButton}>
            <TextInput placeholder="Sets" placeholderTextColor="gray" keyboardType="numeric" value={sets ? sets.toString() : ''}
              onChangeText={(text) => setSets(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
            <Text>X</Text>
            <TextInput placeholder="Reps" placeholderTextColor="gray" keyboardType="numeric" value={reps ? reps.toString() : ''}
              onChangeText={(text) => setReps(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
            <Text>X</Text>
            <TextInput placeholder="Weight" placeholderTextColor="gray" keyboardType="numeric" value={weight ? weight.toString() : ''}
              onChangeText={(text) => setWeight(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
          </View>
        )}
        {selectedMode === 'timed' && (
          <View style={styles.editSetButton}>
            <TextInput placeholder="Sets" placeholderTextColor="gray" keyboardType="numeric" value={sets ? sets.toString() : ''}
              onChangeText={(text) => setSets(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
            <Text>X</Text>
            <TextInput placeholder="Time" placeholderTextColor="gray" keyboardType="numeric" value={reps ? reps.toString() : ''}
              onChangeText={(text) => setTime(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
          </View>
        )}
        {selectedMode === 'body' && (
          <View style={styles.editSetButton}>
            <TextInput placeholder="Sets" placeholderTextColor="gray" keyboardType="numeric" value={sets ? sets.toString() : ''}
              onChangeText={(text) => setSets(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
            <Text>X</Text>
            <TextInput placeholder="Reps" placeholderTextColor="gray" keyboardType="numeric" value={reps ? reps.toString() : ''} 
              onChangeText={(text) => setReps(Number(text))} style={styles.input} returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
          </View>
        )}

          <View style={styles.modalActions}>
            <Pressable style={styles.modalButton} onPress={cancelExercise}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={confirmExercise}>
              <Text>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
    </TouchableWithoutFeedback>
  );
};


const FirstRoute = () => (
  <View style={[styles.container, { backgroundColor: '#303030' }]}>
    <Text style={styles.date}>CHARTS</Text>
    <Text style={styles.date}>Comming soon</Text>
  </View>
);

const ThirdRoute = () => (
  <View style={[styles.container, { backgroundColor: '#303030' }]}>
    <Text style={styles.date}>SOCIAL</Text>
    <Text style={styles.date}>Comming soon</Text>
  </View>
);

export default function App() {
  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState([
    { key: 'first', title: 'Hello' },
    { key: 'main', title: 'Hi' },
    { key: 'third', title: 'Hi' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    main: MainRoute,
    third: ThirdRoute,
  });

  const [fontsLoaded] = useFonts({
    InknutAntiqua_400Regular: require('../assets/fonts/InknutAntiqua-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
        <View style={[styles.indicator, index === 2 ? styles.activeIndicator : null]} />
      </View>
    </View>
  );
}
