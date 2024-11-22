import './App.css'
import Game from './components/Game'
import { GameProvider } from './context/GameContext'
import { clearGameStorage, getVersion, setVersion } from './utils/storage'
import { APP_VERSION } from './constants'


function App() {
  // 版本信息
  console.log(
      '%c Flappy Bird v' + APP_VERSION,
      'color: #fff; background: #6EBEC8; padding: 5px; border-radius: 5px'
  )

  // 判断版本是否有更新
  const lastVersion = getVersion()

  if (lastVersion !== APP_VERSION) {
    // 清除所有以flappy_word开头的缓存
    clearGameStorage()
    // 缓存版本到浏览器
    setVersion(APP_VERSION)
  }

  return (
      <div className="App">
        <GameProvider>
          <Game/>
        </GameProvider>
      </div>
  )
}

export default App
