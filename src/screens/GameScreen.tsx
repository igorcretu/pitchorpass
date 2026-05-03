import { TopBar } from '../components/game/TopBar'
import { InvestorPanel } from '../components/game/InvestorPanel'
import { StartupPanel } from '../components/game/StartupPanel'
import { SelectedSlots } from '../components/game/SelectedSlots'
import { CardHand } from '../components/game/CardHand'
import { SpeechOverlay } from '../components/overlays/SpeechOverlay'
import { ResponseOverlay } from '../components/overlays/ResponseOverlay'

export function GameScreen() {
  return (
    <div className="screen-game">
      <TopBar />
      <div className="game-body">
        <div className="game-left">
          <InvestorPanel />
          <StartupPanel />
          <SelectedSlots />
        </div>
        <CardHand />
      </div>
      <SpeechOverlay />
      <ResponseOverlay />
    </div>
  )
}
