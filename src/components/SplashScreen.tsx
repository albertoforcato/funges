import React, { useEffect, useState } from 'react';
import '../styles/splash-screen.scss';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
  showProgress?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2000,
  showProgress = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300); // Wait for fade out animation
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
      <img
        src='/icons/logo_app.png'
        alt='Fung.es Logo'
        className='splash-logo'
      />
      <h1 className='splash-title'>Fung.es</h1>
      <p className='splash-subtitle'>Mushroom Identification App</p>

      {showProgress ? (
        <div className='splash-progress'>
          <div
            className='splash-progress-bar'
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <div className='splash-loader' />
      )}
    </div>
  );
};

export default SplashScreen;
