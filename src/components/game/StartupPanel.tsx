import { useGameStore } from '../../store/gameStore'

export function StartupPanel() {
  const { currentStartup } = useGameStore()
  if (!currentStartup) return null

  return (
    <div className="startup-panel">
      <div className="panel-tag">Your Startup Idea</div>
      <div className="startup-name">{currentStartup.name}</div>
      <div className="startup-desc">{currentStartup.desc}</div>
    </div>
  )
}
