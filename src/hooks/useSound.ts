import { useCallback } from 'react';

export const useSound = () => {
  const playBeep = useCallback((frequency = 800, duration = 100) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      // Fallback for browsers that don't support AudioContext
      console.log('Beep!');
    }
  }, []);

  const playTyping = useCallback(() => {
    playBeep(1000, 50);
  }, [playBeep]);

  const playEnter = useCallback(() => {
    playBeep(600, 150);
  }, [playBeep]);

  const playLogin = useCallback(() => {
    playBeep(1200, 300);
  }, [playBeep]);

  return { playBeep, playTyping, playEnter, playLogin };
};