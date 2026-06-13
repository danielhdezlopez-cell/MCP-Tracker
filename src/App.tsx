import { useCallback } from 'react';
import { Layout } from './components/Layout';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { IntroSplash } from './components/IntroSplash';
import { useMcpStore } from './store/useMcpStore';

function App() {
  const showIntro   = useMcpStore(s => s.showIntro);
  const setShowIntro = useMcpStore(s => s.setShowIntro);

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, [setShowIntro]);

  return (
    <>
      {showIntro && <IntroSplash onDone={handleIntroDone} />}
      <Layout />
      <PWAUpdatePrompt />
    </>
  );
}

export default App;
