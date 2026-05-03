import './styles/globals.css'
import { useGameStore } from './store/gameStore'
import { SetupScreen } from './screens/SetupScreen'
import { GameScreen } from './screens/GameScreen'
import { EndScreen } from './screens/EndScreen'
import { ProtoBanner } from './components/ProtoBanner'

export default function App() {
  const { screen, backendOnline } = useGameStore()

  const bannerMsg = backendOnline
    ? '<strong>AI Mode</strong> — Claude is live. Investor responses and speech analysis are AI-generated.'
    : '<strong>Demo Mode</strong> — No backend connected. Responses are pre-written placeholders. Start the backend for AI-powered analysis.'

  return (
    <>
      {screen === 'setup' && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
            <ProtoBanner message={bannerMsg} />
          </div>
          <SetupScreen />
        </>
      )}
      {screen === 'game' && <GameScreen />}
      {screen === 'end' && <EndScreen />}
    </>
  )
}
