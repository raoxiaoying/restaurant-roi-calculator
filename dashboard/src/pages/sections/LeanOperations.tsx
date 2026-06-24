import { useApp } from '@/context/AppContext'
import { Beef, Users, ChefHat, ReceiptText, ChevronRight, AlertTriangle, TrendingUp, TrendingDown, PackageCheck, Warehouse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AlertSeverity } from '@/types'

function ChangeTag({ value, label, invert }: { value: number; label: string; invert?: boolean }) {
  const isPositive = value >= 0
  // invert=true means lower is better (e.g. food cost rate, prep time)
  const isGood = invert ? !isPositive : isPositive
  return (
    <span className={`text-caption font-medium flex items-center gap-0.5 ${isGood ? 'text-green-600' : 'text-red-500'}`}>
      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {label}{isPositive ? '+' : ''}{value}%
    </span>
  )
}

interface MetricModuleProps {
  title: string
  icon: React.ReactNode
  iconBg: string
  route: string
  severity: AlertSeverity
  children: React.ReactNode
}

function StatusBadge({ severity }: { severity: AlertSeverity }) {
  if (severity === 'green') return null
  return (
    <span className={`text-caption font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
      severity === 'red' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
    }`}>
      <AlertTriangle size={10} />
      {severity === 'red' ? '紧急' : '提醒'}
    </span>
  )
}

function MetricModule({ title, icon, iconBg, route, severity, children }: MetricModuleProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(route)}
      className="card-elevated p-4 w-full text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge severity={severity} />
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>
      {children}
    </button>
  )
}

export function LeanOperations() {
  const { dailyData, alerts } = useApp()
  const navigate = useNavigate()

  const getModuleSeverity = (moduleId: string): AlertSeverity => {
    return alerts.find(a => a.moduleId === moduleId)?.severity || 'green'
  }

  return (
    <div className="section-container-secondary">
      <div className="mb-3 px-1 flex items-center gap-2">
        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
        <h2 className="section-heading">精益运营</h2>
      </div>

      <div className="space-y-3">
        {/* Food Cost */}
        <MetricModule
          title="食材成本"
          icon={<Beef size={18} />}
          iconBg="bg-blue-50 text-blue-500"
          route="/food-cost"
          severity={getModuleSeverity('foodCost')}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-metric font-bold text-gray-900">{dailyData.foodCost.rate}</span>
            <span className="text-body-sm text-gray-500">%</span>
          </div>
          <p className="text-caption text-gray-500 mt-1">
            目标 ≤{dailyData.foodCost.target}% · 金额 ¥{dailyData.foodCost.amount.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <ChangeTag value={dailyData.foodCost.rateMoM} label="环比" invert />
          </div>
        </MetricModule>

        {/* HR */}
        <MetricModule
          title="人力资源"
          icon={<Users size={18} />}
          iconBg="bg-blue-50 text-blue-500"
          route="/hr/labor"
          severity={getModuleSeverity('hr')}
        >
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div>
              <p className="text-caption text-gray-500">人效</p>
              <p className="text-metric-sm font-bold text-gray-900">¥{dailyData.hr.laborEfficiency.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <ChangeTag value={dailyData.hr.laborEfficiencyMoM} label="环比" />
              </div>
            </div>
            <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/hr/training') }}>
              <p className="text-caption text-gray-500">训练率</p>
              <p className="text-body-sm font-bold text-gray-900">
                {dailyData.hr.training.trainingRate}%
              </p>
            </div>
            <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/hr/turnover') }}>
              <p className="text-caption text-gray-500">离职率</p>
              <p className="text-body-sm font-bold text-gray-900">
                {dailyData.hr.turnoverRate}%
              </p>
            </div>
          </div>
        </MetricModule>

        {/* Kitchen */}
        <MetricModule
          title="出餐效率"
          icon={<ChefHat size={18} />}
          iconBg="bg-blue-50 text-blue-500"
          route="/kitchen"
          severity={getModuleSeverity('kitchen')}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-metric font-bold text-gray-900">{dailyData.kitchen.avgPrepTime}</span>
            <span className="text-body-sm text-gray-500">分钟/单</span>
          </div>
          <p className="text-caption text-gray-500 mt-1">
            目标 ≤{dailyData.kitchen.target}分钟 · 今日{dailyData.kitchen.totalOrders}单
          </p>
          <div className="flex items-center gap-2 mt-1">
            <ChangeTag value={dailyData.kitchen.avgPrepTimeMoM} label="环比" invert />
          </div>
        </MetricModule>

        {/* Audit Returns/Gifts/Price Change */}
        <div className="card-elevated p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500">
                <ReceiptText size={18} />
              </div>
              <h3 className="card-title">退赠改</h3>
            </div>
            <StatusBadge severity={getModuleSeverity('audit')} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div>
              <p className="text-caption text-gray-500">退菜</p>
              <p className="text-body-sm font-bold text-gray-900">¥{dailyData.audit.returnsTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-caption text-gray-500">赠菜</p>
              <p className="text-body-sm font-bold text-gray-900">¥{dailyData.audit.complimentaryTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-caption text-gray-500">改价</p>
              <p className="text-body-sm font-bold text-gray-900">¥{dailyData.audit.priceChangeTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Sold-out Rate */}
        <MetricModule
          title="沽清率"
          icon={<PackageCheck size={18} />}
          iconBg="bg-orange-50 text-orange-500"
          route="/sold-out"
          severity={getModuleSeverity('soldOut')}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-metric font-bold text-gray-900">{dailyData.soldOut.rate}</span>
            <span className="text-body-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ChangeTag value={dailyData.soldOut.rateMoM} label="环比" invert />
          </div>
        </MetricModule>

        {/* Inventory Efficiency */}
        <MetricModule
          title="库存效率"
          icon={<Warehouse size={18} />}
          iconBg="bg-purple-50 text-purple-500"
          route="/inventory"
          severity={getModuleSeverity('inventory')}
        >
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <p className="text-caption text-gray-500">库存周转率</p>
              <p className="text-body-sm font-bold text-gray-900">{dailyData.inventory.turnoverRate}次</p>
              <div className="flex items-center gap-2 mt-0.5">
                <ChangeTag value={dailyData.inventory.turnoverRateMoM} label="环比" />
              </div>
            </div>
            <div>
              <p className="text-caption text-gray-500">库存金额</p>
              <p className="text-body-sm font-bold text-gray-900">¥{dailyData.inventory.amount.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <ChangeTag value={dailyData.inventory.amountMoM} label="环比" invert />
              </div>
            </div>
          </div>
        </MetricModule>
      </div>
    </div>
  )
}
