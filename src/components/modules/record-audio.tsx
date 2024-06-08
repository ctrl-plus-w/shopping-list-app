import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { Audio } from 'expo-av';

interface IProps {
  onStopRecording: (uri: string) => Promise<void>;
}

const RecordAudio = ({ onStopRecording }: IProps) => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const startRecording = async () => {
    try {
      if (permissionResponse && permissionResponse.status !== 'granted') await requestPermission();

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
      });

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    const uri = recording.getURI();
    if (!uri) return;

    await onStopRecording(uri);
  };

  return (
    <Button onPressIn={startRecording} onPressOut={stopRecording}>
      <Ionicons name="mic" size={22} color="white" />
    </Button>
  );
};

export default RecordAudio;
