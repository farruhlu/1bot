import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

type VoiceState = {
  listening: boolean;
  transcript: string;
  error: string | null;
  available: boolean;
};

export function useVoiceInput(onFinal?: (text: string) => void) {
  const [state, setState] = useState<VoiceState>({
    listening: false,
    transcript: '',
    error: null,
    available: true,
  });

  useEffect(() => {
    try {
      const ok = ExpoSpeechRecognitionModule.isRecognitionAvailable();
      setState((s) => ({ ...s, available: ok }));
    } catch {
      setState((s) => ({ ...s, available: Platform.OS === 'web' }));
    }
  }, []);

  useSpeechRecognitionEvent('start', () => {
    setState((s) => ({ ...s, listening: true, error: null }));
  });

  useSpeechRecognitionEvent('end', () => {
    setState((s) => ({ ...s, listening: false }));
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results?.[0]?.transcript?.trim() ?? '';
    if (!text) return;
    setState((s) => ({ ...s, transcript: text }));
    if (event.isFinal) {
      onFinal?.(text);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    setState((s) => ({
      ...s,
      listening: false,
      error: event.message || event.error || 'Ошибка распознавания',
    }));
  });

  const start = useCallback(async () => {
    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setState((s) => ({
          ...s,
          error: 'Нужен доступ к микрофону и распознаванию речи',
        }));
        return;
      }
      setState((s) => ({ ...s, transcript: '', error: null }));
      ExpoSpeechRecognitionModule.start({
        lang: 'ru-RU',
        interimResults: true,
        continuous: false,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        error:
          e instanceof Error
            ? e.message
            : 'Голосовой ввод недоступен в этой среде',
      }));
    }
  }, []);

  const stop = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // ignore
    }
  }, []);

  return { ...state, start, stop };
}
