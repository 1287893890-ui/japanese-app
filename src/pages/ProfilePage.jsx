import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useStreak } from '../hooks/useStreak'
import { LEVELS, LEVEL_CONFIG } from '../utils/levels'
import Card from '../components/shared/Card'
import ProgressBar from '../components/shared/ProgressBar'

const ACHIEVEMENTS = [
  { id: 'first-word', title: '初始的一步', icon: '🌱', desc: '学习第一个单词', condition: (s) => s.completedVocabulary.length >= 1 },
  { id: 'words-50', title: '词汇达人', icon: '📖', desc: '学习50个单词', condition: (s) => s.completedVocabulary.length >= 50 },
  { id: 'words-100', title: '百词达成', icon: '💯', desc: '学习100个单词', condition: (s) => s.completedVocabulary.length >= 100 },
  { id: 'streak-3', title: '突破三日', icon: '🔥', desc: '连续学习3天', condition: (s) => s.streak.current >= 3 },
  { id: 'streak-7', title: '连续一周', icon: '🌟', desc: '连续学习7天', condition: (s) => s.streak.current >= 7 },
  { id: 'streak-30', title: '全勤奖', icon: '👑', desc: '连续学习30天', condition: (s) => s.streak.current >= 30 },
  { id: 'perfect-quiz', title: '满分达成', icon: '💎', desc: '任意测验取得满分', condition: (s) => Object.values(s.quizScores).some(q => q.score === q.total) },
  { id: 'n5-complete', title: 'N5通关', icon: '🎓', desc: '学完N5全部词汇', condition: (s) => s.completedVocabulary.filter(id => id.startsWith('n5')).length >= 20 },
]

export default function ProfilePage() {
  const { state } = useApp()
  const streak = useStreak()

  const allVocab = state.completedVocabulary.length
  const allGrammar = state.completedGrammar.length
  const allDialogue = state.completedDialogues.length
  const quizCount = Object.keys(state.quizScores).length
  const totalCompleted = allVocab + allGrammar + allDialogue + quizCount

  const isUnlocked = (ach) => {
    return state.achievements.some(a => a.id === ach.id)
  }

  const levelProgress = (lvl) => {
    const prefix = lvl.toLowerCase()
    return state.completedVocabulary.filter(id => id.startsWith(prefix)).length
  }

  return (
    <div className="p-4 pb-24 space-y-5">
      {/* Profile Header */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand to-brand-dark rounded-full
          flex items-center justify-center text-3xl shadow-lg">
          👤
        </div>
        <h2 className="text-xl font-bold text-slate-800">日语学习者</h2>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-amber-500">
            🔥 {streak.current} 天连续学习
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">总计 {totalCompleted} 项</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '学习词汇', value: allVocab, icon: '📖', color: 'from-emerald-400 to-emerald-500' },
          { label: '掌握语法', value: allGrammar, icon: '📝', color: 'from-blue-400 to-blue-500' },
          { label: '完成对话', value: allDialogue, icon: '💬', color: 'from-purple-400 to-purple-500' },
          { label: '参加测验', value: quizCount, icon: '✏️', color: 'from-amber-400 to-amber-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-sm`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Level Progress */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-800 mb-3">等级进度</h3>
        <div className="space-y-2">
          {LEVELS.map(lvl => {
            const config = LEVEL_CONFIG[lvl]
            const progress = levelProgress(lvl)
            return (
              <div key={lvl} className="flex items-center gap-3">
                <span className="text-sm w-8">{lvl}</span>
                <ProgressBar value={progress} max={lvl === 'N5' ? 105 : 20} color={`bg-[${config.color}]`} className="flex-1" />
                <span className="text-xs text-slate-400 w-8 text-right">{progress}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-4">
        <h3 className="font-semibold text-slate-800 mb-3">
          🏆 成就 ({state.achievements.length}/{ACHIEVEMENTS.length})
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {ACHIEVEMENTS.map((ach, i) => {
            const unlocked = isUnlocked(ach) || ach.condition(state)
            const found = state.achievements.find(a => a.id === ach.id)
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-2 rounded-xl text-center transition-all ${unlocked ? 'bg-white border border-slate-100' : 'bg-slate-50 opacity-40'}`}
                title={`${ach.title}: ${ach.desc}`}
              >
                <span className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>{ach.icon}</span>
                <p className="text-xs text-slate-500 mt-0.5">{ach.title}</p>
                {unlocked && found?.unlockedAt && (
                  <p className="text-xs text-slate-300">{found.unlockedAt.slice(5)}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Quick Links */}
      <div className="space-y-2">
        <Link to="/settings">
          <Card className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-xl">⚙️</span>
            <div className="flex-1">
              <p className="font-medium text-slate-800 text-sm">设置</p>
              <p className="text-xs text-slate-400">声音、振假名、每日目标</p>
            </div>
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Card>
        </Link>
      </div>
    </div>
  )
}
