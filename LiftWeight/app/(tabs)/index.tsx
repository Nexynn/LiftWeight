import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec titre et flèches */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="white" />
        <Text style={styles.title}>TODAY</Text>
        <Ionicons name="chevron-forward" size={24} color="white" />
      </View>

      {/* Bouton Ajouter Exercice */}
      <View style={styles.addExerciseContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="black" />
          <Text style={styles.addText}>Add exercice</Text>
        </TouchableOpacity>
      </View>

      {/* Footer avec icônes */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome5 name="user-alt" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome5 name="chart-line" size={24} color="black" />
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
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addExerciseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  addText: {
    marginLeft: 10,
    fontSize: 18,
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
});
