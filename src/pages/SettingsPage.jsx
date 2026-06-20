import { useApp } from '../context/AppContext'
import Card from '../components/shared/Card'

export default function SettingsPage() {
  const { state, dispatch } = useApp()
  const { settings } = state

  const toggle = (key) => {
    dispatch({ type: 'UPDATE_SETTINGS', key, value: !settings[key] })
  }

  const dailyGoalOptions = [10, 20, 30, 50, 100]

  return (
    <div className="p-4 pb-8 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">⚙️ 设置</h2>
        <p className="text-sm text-slate-400 mt-1">自定义你的学习体验</p>
      </div>

      {/* Sound */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-3">🔊 声音</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">自动朗读</p>
              <p className="text-xs text-slate-400">翻转闪卡时自动朗读发音</p>
            </div>
            <button
              onClick={() => toggle('autoPlayAudio')}
              className={`w-12 h-7 rounded-full transition-colors relative ${settings.autoPlayAudio ? 'bg-success' : 'bg-slate-300'}`}
            >
              <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-200"
                style={{ left: settings.autoPlayAudio ? '22px' : '2px' }} />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">音效</p>
              <p className="text-xs text-slate-400">答题反馈音效</p>
            </div>
            <button
              onClick={() => toggle('soundEnabled')}
              className={`w-12 h-7 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-success' : 'bg-slate-300'}`}
            >
              <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-200"
                style={{ left: settings.soundEnabled ? '22px' : '2px' }} />
            </button>
          </label>
        </div>
      </Card>

      {/* Display */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-3">📱 显示</h3>
        <label className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">显示振假名</p>
            <p className="text-xs text-slate-400">在汉字上方显示假名注音</p>
          </div>
          <button
            onClick={() => toggle('showFurigana')}
            className={`w-12 h-7 rounded-full transition-colors relative ${settings.showFurigana ? 'bg-success' : 'bg-slate-300'}`}
          >
            <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-200"
              style={{ left: settings.showFurigana ? '22px' : '2px' }} />
          </button>
        </label>
      </Card>

      {/* Daily Goal */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-3">🎯 每日目标</h3>
        <p className="text-xs text-slate-400 mb-3">每天计划学习的项目数</p>
        <div className="flex gap-2">
          {dailyGoalOptions.map(goal => (
            <button
              key={goal}
              onClick={() => {
                dispatch({ type: 'SET_DAILY_GOAL', goal })
                dispatch({ type: 'UPDATE_SETTINGS', key: 'dailyGoal', value: goal })
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
                ${state.dailyGoal === goal
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {goal}
            </button>
          ))}
        </div>
      </Card>

      {/* About */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">ℹ️ 关于</h3>
        <p className="text-xs text-slate-400">
          日语学习 App · JLPT N5~N1
        </p>
        <p className="text-xs text-slate-400 mt-1">
          内容覆盖日语能力考试全部等级。包含词汇、语法、对话学习及模拟测验。
        </p>
        <p className="text-xs text-slate-300 mt-2">版本 1.0.0</p>
      </Card>
    </div>
  )
}
