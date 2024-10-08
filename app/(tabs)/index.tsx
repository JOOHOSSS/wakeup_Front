import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SetStateAction, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [sound, setSound] = useState<Audio.Sound|null>(null); // Since you are initializing sound state as undefined (useState()), Typescript doesn't allow setting sound to any other type.
  const [location, setLocation] = useState<Location.LocationObject|null>(null);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log(text)
  }



  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../../assets/notification.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    }); // ios silentMode
    return sound
      ? () => {
          console.log('Unloading Sound');
          //sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Button title="Play Sound" onPress={playSound} />
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  }
});
