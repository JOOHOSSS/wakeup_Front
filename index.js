/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const App = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.front} // 셀카 모드
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false} // 동영상이 아닌 사진만 찍을 경우 설정
      >
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') return <Text>카메라 로딩 중...</Text>;
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={takePicture} style={styles.capture}>
                <Text style={styles.captureText}> 셀카 찍기 </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureText: {
    fontSize: 14,
  },
});

export default App;

