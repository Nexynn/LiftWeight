import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFonts, InknutAntiqua_400Regular } from '@expo-google-fonts/inknut-antiqua';

export default function App() {
  const [fontsLoaded] = useFonts({
      InknutAntiqua_400Regular,
    });

  const handleBackPress = () => {
      console.log('Back button pressed');
      // Ajoute ton code ici pour la navigation ou autres actions
    };

    const handleForwardPress = () => {
      console.log('Forward button pressed');
      // Ajoute ton code ici pour la navigation ou autres actions
    };

    const handlePress = () => {
      console.log('Button pressed');
      // Ajoute ton code ici pour la navigation ou autres actions
    };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
          {/* Chevron gauche cliquable */}
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="chevron-back" size={24} color="white" style={styles.chevron}/>
          </TouchableOpacity>

          {/* Titre */}
          <Text style={styles.title}>TODAY</Text>

          {/* Chevron droit cliquable */}
          <TouchableOpacity onPress={handleForwardPress}>
            <Ionicons name="chevron-forward" size={24} color="white" style={styles.chevron}/>
          </TouchableOpacity>
       </View>

      {/* Bouton Ajouter Exercise */}
      <View style={styles.addExerciseContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handlePress}>
          <Ionicons name="add" size={110} color="black"/>
          <Text style={styles.addText}>Add exercise</Text>
        </TouchableOpacity>
      </View>

      {/* Footer avec icônes */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={handlePress}>
          <Image
            source={require('../../assets/icons/personalBest-icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handlePress}>
          <Image
            source={require('../../assets/icons/chart-icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  chevron: {
    marginHorizontal: 40, // Réduire cet espace pour rapprocher les chevrons du titre
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'InknutAntiqua_400Regular',
  },
  addExerciseContainer: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'left',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 0,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  addText: {
    marginLeft: 20,
    fontSize: 23,
    fontFamily: 'InknutAntiqua_400Regular',
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
  },
  iconButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
  },
  icon: {
      width: 80,  // Taille de l'icône
      height: 80,  // Taille de l'icône
    },
});
