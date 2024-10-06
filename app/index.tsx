import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList, Modal, Image, TextInput, ActivityIndicator} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { useFonts } from 'expo-font';


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
  const [date, setDate] = React.useState(new Date());

  const [presetName, setPresetName] = React.useState<string>('');
  const [presets, setPresets] = React.useState<{ name: string; buttons: any[] }[]>([{ name: 'Clear', buttons: [] }]);
  const [createModalVisible, setCreateModalVisible] = React.useState(false);
  const [selectModalVisible, setSelectModalVisible] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);

  const [buttons, setButtons] = React.useState<{ id: number; iconId: number | null, mode: string, series: number, reps: number, weight: number, time: number }[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedIconId, setSelectedIconId] = React.useState<number | null>(null);
  const [selectedMode, setSelectedMode] = React.useState<string>('weighted');
  const [series, setSeries] = React.useState<number>(0);
  const [reps, setReps] = React.useState<number>(0);
  const [weight, setWeight] = React.useState<number>(0);
  const [time, setTime] = React.useState<number>(0);

  React.useEffect(() => {
    // Récupérer les données de la date actuelle au chargement
    retrieveDataForDate(formatDateKey(date));
    retrievePresets();
  }, []);

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
        series: series,
        reps: reps,
        weight: weight,
        time: time,
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

  // Fonction pour supprimer un preset
  const deletePreset = (presetName: string) => {
    setPresets(presets.filter((preset) => preset.name !== presetName));
  };

  return (
    <View style={[styles.container, { backgroundColor: '#303030' }]}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
        {/* Chevron gauche pour diminuer la date */}
        <TouchableOpacity 
          onPress={() => changeDate(-1)} 
          style={{ position: 'absolute', transform: [{ translateX: -120 }] }}
        >
          <AntDesign name="left" size={24} color="white" />
        </TouchableOpacity>

        {/* Affichage de la date */}
        <Text style={styles.date}>{formatDate(date)}</Text>

        {/* Chevron droit pour augmenter la date */}
        <TouchableOpacity 
          onPress={() => changeDate(1)} 
          style={{ position: 'absolute', transform: [{ translateX: 120 }] }}
        >
          <AntDesign name="right" size={24} color="white" />
        </TouchableOpacity>
      </View>



    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
      <TouchableOpacity style={styles.iconButtonPreset} onPress={() => setCreateModalVisible(true)}>
        <AntDesign name="plus" size={20} color="black" />
        <Text style={styles.iconLabel}>Create Preset</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButtonPreset} onPress={() => setSelectModalVisible(true)}>
        <AntDesign name="bars" size={20} color="black" />
        <Text style={styles.iconLabel}>Choose Preset</Text>
      </TouchableOpacity>
    </View>

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
              <TouchableOpacity style={styles.modalButton} onPress={() => setCreateModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={savePreset}>
                <Text>Save</Text>
              </TouchableOpacity>
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
                  <TouchableOpacity style={styles.presetItem} onPress={() => selectPreset(item.name)}>
                    <Text style={styles.presetText}>{item.name}</Text>
                  </TouchableOpacity>
                  {/* Afficher le bouton de suppression uniquement si ce n'est pas le preset "Clear" */}
                  {item.name !== 'Clear' && (
                    <TouchableOpacity onPress={() => deletePreset(item.name)} style={styles.deleteButton}>
                      <AntDesign name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
            <TouchableOpacity style={styles.modalButtonClosePreset} onPress={() => setSelectModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </Modal>


    {!modalVisible && (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {buttons.map((button) => {
        const icon = exerciseIcons.find((icon) => icon.id === button.iconId);
        return (
          <TouchableOpacity key={button.id} style={styles.button}>
            {icon && icon.type === 'antdesign' ? (
              <AntDesign name={icon.name || "plus"} size={30} color="black" style={styles.icon} />
            ) : icon && icon.iconComponent ? (
              <Image source={icon.iconComponent} style={{ width: 25, height: 25 }} />
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
                {button.series} Series x {button.reps} Reps
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
            <TextInput placeholder="Series" keyboardType="numeric" value={series ? series.toString() : ''} onChangeText={(text) => setSeries(Number(text))} style={styles.input} />
            <TextInput placeholder="Reps" keyboardType="numeric" value={reps ? reps.toString() : ''} onChangeText={(text) => setReps(Number(text))} style={styles.input} />
            <TextInput placeholder="Weight (kg)" keyboardType="numeric" value={weight ? weight.toString() : ''} onChangeText={(text) => setWeight(Number(text))} style={styles.input} />
          </View>
        )}
        {selectedMode === 'timed' && (
          <View>
            <TextInput placeholder="Series" keyboardType="numeric" value={series ? series.toString() : ''} onChangeText={(text) => setSeries(Number(text))} style={styles.input} />
            <TextInput placeholder="Time (seconds)" keyboardType="numeric" value={reps ? reps.toString() : ''} onChangeText={(text) => setTime(Number(text))} style={styles.input} />
          </View>
        )}
        {selectedMode === 'body' && (
          <View>
            <TextInput placeholder="Series" keyboardType="numeric" value={series ? series.toString() : ''} onChangeText={(text) => setSeries(Number(text))} style={styles.input} />
            <TextInput placeholder="Reps" keyboardType="numeric" value={reps ? reps.toString() : ''} onChangeText={(text) => setReps(Number(text))} style={styles.input} />
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
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Hello' },
    { key: 'second', title: 'Hi' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
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
      </View>
    </View>
  );
}
