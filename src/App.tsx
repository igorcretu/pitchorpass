import './styles/globals.css'
import { useGameStore } from './store/gameStore'
import { LandingScreen } from './screens/LandingScreen'
import { SetupScreen } from './screens/SetupScreen'
import { GameScreen } from './screens/GameScreen'
import { EndScreen } from './screens/EndScreen'

export default function App() {
  const { screen } = useGameStore()

  return (
    <>
      {screen === 'landing' && <LandingScreen />}
      {screen === 'setup'   && <SetupScreen />}
      {screen === 'game'    && <GameScreen />}
      {screen === 'end'     && <EndScreen />}
    </>
  )
}
