import { StyleSheet, Dimensions } from 'react-native';


const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
      marginBottom: 60,
    },
    scrollContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    button: {
      backgroundColor: '#f0f0f0',
      padding: 5,
      marginVertical: 10,
      borderRadius: 10,
      width: Dimensions.get('window').width * 0.7, // Pour prendre environ 90% de la largeur de l'écran
      alignItems: 'center',
    },
    icon: {
    },
    buttonText: {
      marginBottom: -10,
      marginTop: -5,
      fontSize: 20,
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
    typeButtonActive: {
      backgroundColor: '#ccc',
      padding: 10,
      borderRadius: 5,
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
    modalButtonClosePreset: {
      backgroundColor: '#eaeaea',
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 20,
      marginTop: 10,
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
      width: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      width: Dimensions.get('window').width * 0.3,
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
  
    headerText: {
      fontSize: 24,
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    presetItem: {
      padding: 10,
      marginTop: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      width: '100%',
      alignItems: 'center',
    },
    presetText: {
      fontSize: 18,
    },
    selectedText: {
      marginTop: 20,
      fontSize: 18,
      fontStyle: 'italic',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    iconLabel: {
      marginTop: 10,
      fontSize: 16,
    },
    iconButtonPreset: {
      alignItems: 'center',
      margin: 10,
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: '#ccc',
    },
    presetItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      width: Dimensions.get('window').width * 0.7,
    },
    deleteButton: {
      
      padding: 5,
    },
  });

export default styles;