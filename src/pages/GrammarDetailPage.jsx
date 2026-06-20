import { useParams, useNavigate } from 'react-router-dom'
import { getGrammarPoint } from '../data'
import { useApp } from '../context/AppContext'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'

export default function GrammarDetailPage() {
  const { level, id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const point = getGrammarPoint(level, id)
  const isCompleted = state.completedGrammar.includes(id)

  if (!point) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-2">😕</p>
        <p className="text-slate-500">未找到该语法点</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand text-sm">返回</button>
      </div>
    )
  }

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_GRAMMAR', id })
  }

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="text-center">
        <span className="text-3xl">{point.emoji}</span>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">{point.title}</h2>
        <p className="text-slate-400">{point.titleCn}</p>
      </div>

      {/* Formation / Pattern */}
      <Card className="p-4 bg-gradient-to-br from-brand/5 to-brand/10 border-brand/20">
        <h3 className="text-sm font-semibold text-brand mb-2">📐 句型结构</h3>
        <div className="bg-white rounded-xl p-3 text-center">
          <code className="text-lg font-bold text-slate-800">{point.formation.pattern}</code>
        </div>
        <p className="text-sm text-slate-600 mt-2">{point.formation.meaning}</p>
        <p className="text-xs text-slate-400 mt-1">{point.formation.note}</p>
      </Card>

      {/* Conjugation Table */}
      {point.formation.conjugationTable && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">📋 活用表</h3>
          {Object.entries(point.formation.conjugationTable).map(([category, verbs]) => (
            <div key={category} className="mb-3 last:mb-0">
              <p className="text-xs font-medium text-slate-500 mb-1.5">{category}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400">
                      <th className="text-left py-1 pr-2">辞書形</th>
                      {verbs[0]?.teForm !== undefined && <th className="text-left py-1 pr-2">て形</th>}
                      {verbs[0]?.teKudasai !== undefined && <th className="text-left py-1">てください</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {verbs.map((v, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="py-1.5 pr-2 font-medium text-slate-700">{v.dictionary}</td>
                        {v.teForm !== undefined && <td className="py-1.5 pr-2 text-slate-600">{v.teForm}</td>}
                        {v.teKudasai !== undefined && <td className="py-1.5 text-slate-600">{v.teKudasai}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Examples */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">📝 例句</h3>
        <div className="space-y-3">
          {point.examples.map((ex, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl">
              <p className="font-medium text-slate-800">{ex.jp}</p>
              <p className="text-sm text-slate-400 mt-0.5">{ex.reading}</p>
              <p className="text-sm text-slate-500 mt-1">{ex.cn}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Common Mistakes */}
      {point.commonMistakes && (
        <Card className="p-4 bg-amber-50 border-amber-100">
          <h3 className="text-sm font-semibold text-amber-700 mb-1">⚠️ 常见错误</h3>
          <p className="text-sm text-amber-600">{point.commonMistakes}</p>
        </Card>
      )}

      {/* Mark Complete */}
      <div className="pt-2">
        {!isCompleted ? (
          <Button variant="success" size="lg" className="w-full" onClick={handleComplete}>
            ✅ 标记为已掌握
          </Button>
        ) : (
          <div className="text-center py-3 bg-success-light rounded-2xl">
            <p className="text-success font-semibold">✅ 已掌握 {new Date().toLocaleDateString('zh-CN')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
