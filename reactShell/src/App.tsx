import { useEffect } from 'react'
import GameCanvas from './game/GameCanvas'
import Hud from './ui/Hud'
import UpgradeMenu from './ui/UpgradeMenu'
import StatusOverlay from './ui/StatusOverlay'
import PauseOverlay from './ui/PauseOverlay'

function App() {
  useEffect(() => {
    // Initialize game
    console.log('Asteroids React Shell initializing...')
  }, [])

  return (
    <div className="app">
      <GameCanvas />
      <Hud />
      <UpgradeMenu />
      <StatusOverlay />
      <PauseOverlay />
    </div>
  )
}

export default App