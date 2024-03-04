import settingIcon from '@renderer/assets/setting.svg'
import refreshIcon from '@renderer/assets/refresh.svg'
import SetUp from './components/SetUp'
import { useState } from 'react'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="h-screen bg-[#1B1B1D] p-4 select-none overflow-x-hidden overflow-y-auto">
      {!isVisible && (
        <>
          <div className="w-full flex justify-end">
            <div
              className="bg-[#31353E] px-3 py-1 rounded-md cursor-pointer"
              onClick={() => setIsVisible(!isVisible)}
            >
              <img src={settingIcon} alt="设置" />
            </div>
          </div>
          <div className="bg-[#31353E] p-3 mt-4 rounded-lg">
            <div className="flex justify-between">
              <div className="text-gray-400 text-xs">
                <span className="text-white">杭州市</span>
                <span className="pl-1 cursor-pointer">切换</span>
              </div>
              <div className="text-gray-400 text-xs flex items-center">
                <span>12:00 更新</span>
                <div className="pl-1 cursor-pointer">
                  <img src={refreshIcon} alt="刷新" />
                </div>
              </div>
            </div>
            <div className="py-4 flex items-center">
              <div className="text-white text-5xl">24°</div>
              <div className="pl-2">
                <div className="text-white text-xs">晴</div>
                <div className="text-xs flex items-center pt-1">
                  <div className="border px-1 border-amber-400 mr-1 text-amber-400">AQI 优</div>
                  <div className="text-white">东北风 3-4级</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs">
                <span className="text-gray-400 pr-1">湿度</span>
                <span className="text-white">60%</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-400 pr-1">紫外线</span>
                <span className="text-white">弱</span>
              </div>
              <div className="text-xs">
                <span className="text-gray-400 pr-1">大气压</span>
                <span className="text-white">1000Hpa</span>
              </div>
            </div>
          </div>
          <div className="h-52 bg-[#31353E] p-3 mt-4 rounded-lg overflow-x-auto">
            <div className="text-gray-400 text-xs">24小时预报</div>
            <div className="w-[30rem] h-40 pt-2 grid grid-cols-12 gap-4 items-end text-center">
              {['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '00'].map(
                (item, index) => (
                  <div className="w-14" key={index}>
                    <div className="text-white text-xs mb-1">13°</div>
                    <div
                      style={{ height: index * 10 }}
                      className={`m-auto w-3 bg-amber-400 rounded-md`}
                    ></div>
                    <div className="m-auto w-3 mt-1">
                      <img src={refreshIcon} alt="刷新" />
                    </div>
                    <div className="text-gray-400 text-[10px] mt-1">{item} 时</div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="h-52 bg-[#31353E] p-3 mt-4 rounded-lg overflow-y-auto">
            <div className="text-gray-400 text-xs">7天预报</div>
            <div className=" h-40 pt-2">
              {['02', '04', '06', '08', '10', '12', '14'].map((item, index) => (
                <div
                  className="flex items-center h-10 border-b-[1px] border-b-[#353A42]"
                  key={index}
                >
                  <div className="text-white text-xs">今天</div>
                  <div className="text-white text-xs mx-2 text-center">
                    <div>{item}</div>
                    <div className="w-5 h-[2px] bg-amber-400"></div>
                  </div>
                  <div className="m-auto w-3 mr-2">
                    <img src={refreshIcon} alt="刷新" />
                  </div>
                  <div className="flex flex-1 items-center">
                    <div className="text-xs text-white">10°</div>
                    <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-2"></div>
                    <div className="text-xs text-white">5°</div>
                  </div>
                  <div className="m-auto w-3 ml-2">
                    <img src={refreshIcon} alt="刷新" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden">
            <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
              Send IPC
            </a>
          </div>
        </>
      )}
      {isVisible && <SetUp onChange={(isVisible) => setIsVisible(isVisible)} />}
    </div>
  )
}

export default App
