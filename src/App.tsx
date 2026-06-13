import { useCallback, useState } from 'react';
import { Layout } from './components/Layout';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { IntroSplash } from './components/IntroSplash';

// Show intro only once per browser session (not on tab switches or SPA nav)
const SESSION_KEY = 'mcp-intro-seen';
const alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1';

function App() {
  const [showIntro, setShowIntro] = useState(!alreadySeen);

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroSplash onDone={handleIntroDone} />}
      <Layout />
      <PWAUpdatePrompt />
    </>
  );
}

export default App;
