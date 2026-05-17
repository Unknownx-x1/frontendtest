import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  Activity,
  Apple,
  AudioWaveform,
  BadgeAlert,
  Beef,
  Bot,
  Brain,
  ChevronUp,
  Cross,
  Dumbbell,
  Flame,
  HeartPulse,
  IndianRupee,
  MessageSquareText,
  Microscope,
  Play,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Target,
  Zap,
} from 'lucide-react'

const bodyParts = [
  { id: 'shoulder', label: 'Shoulder', x: 49, y: 28 },
  { id: 'back', label: 'Back', x: 51, y: 42 },
  { id: 'knee', label: 'Knee', x: 47, y: 70 },
  { id: 'ankle', label: 'Ankle', x: 55, y: 88 },
]

const modules = [
  {
    id: 'injury',
    title: 'Injury Recovery',
    label: 'Diagnostic chamber',
    copy: 'Scan pain, body region, recovery timeline, and athlete-safe return-to-play guidance.',
    Icon: Cross,
    stat: 'AI rehab',
  },
  {
    id: 'nutrition',
    title: 'Nutrition Plan',
    label: 'Fuel engine',
    copy: 'Affordable Indian meals, hydration, match-day fuel, and recovery macros.',
    Icon: Beef,
    stat: 'Rs budget',
  },
  {
    id: 'coach',
    title: 'Coach + Doctor',
    label: 'Command terminal',
    copy: 'Switch between motivational coach energy and calm clinical safety support.',
    Icon: Bot,
    stat: 'Live assist',
  },
]

const foodPlans = [
  { time: '05:40', mode: 'Pre-run', meal: 'Banana, soaked chana, black coffee', cost: 'Rs 28', macro: 'Fast carbs' },
  { time: '08:10', mode: 'Recovery', meal: 'Poha with peanuts, curd, jaggery water', cost: 'Rs 52', macro: 'Glycogen refill' },
  { time: '13:25', mode: 'Strength', meal: 'Rice, dal, egg bhurji, cucumber', cost: 'Rs 74', macro: 'Protein base' },
  { time: '20:00', mode: 'Repair', meal: 'Roti, paneer/tofu, seasonal sabzi', cost: 'Rs 86', macro: 'Tissue repair' },
]

const recoveryDrills = [
  { name: 'Isometric Hold', load: 'Low', reps: '4 x 30s', signal: 'Pain-free strength' },
  { name: 'Mobility Reset', load: 'Controlled', reps: '8 min', signal: 'Range rebuild' },
  { name: 'Return-to-Play Test', load: 'Progressive', reps: 'Day 9+', signal: 'Impact tolerance' },
]

const sports = ['Cricket', 'Football', 'Kabaddi', 'Wrestling', 'Athletics', 'Badminton', 'Hockey', 'Boxing']
const injuryParts = ['Knee', 'Ankle', 'Shoulder', 'Back', 'Hamstring', 'Wrist', 'Elbow', 'Neck']
const regions = ['North India', 'South India', 'West India', 'East India', 'Central India', 'North-East India']
const nutritionGoals = ['Build Strength', 'Lose Weight', 'Match Performance', 'Recovery']
const diets = ['Vegetarian', 'Egg', 'Non-Veg']
const phases = ['Off Season', 'Pre-Season', 'Match Week', 'Recovery Week']

function apiFallback(endpoint, payload) {
  const data = {
    '/api/injury': {
      timeline: payload.painSeverity > 7 ? 'Doctor review now + 14-21 day protected recovery' : '5-10 day guided recovery block',
      risk: payload.painSeverity > 7 ? 'High alert' : 'Moderate',
      note: 'Stop training if swelling, numbness, deformity, fever, or sharp pain appears.',
    },
    '/api/nutrition': {
      calories: 2840,
      hydration: '3.2L + electrolytes after sweat-heavy sessions',
      budget: 'Rs 210 daily field-ready plan',
    },
    '/api/chat': {
      reply:
        payload.mode === 'doctor'
          ? 'Keep today clinical: reduce load, track pain, and seek a doctor if symptoms escalate.'
          : 'You are not behind. Hit the next clean rep, recover with discipline, and come back sharper tomorrow.',
    },
  }
  return new Promise((resolve) => setTimeout(() => resolve(data[endpoint]), 900))
}

async function postAI(endpoint, payload) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('API unavailable')
    return await res.json()
  } catch {
    return apiFallback(endpoint, payload)
  }
}

function MetricTicker({ label, value }) {
  return (
    <motion.div
      className="metric-ticker"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </motion.div>
  )
}

function AthleteSilhouette({ pain = 4, selected = 'knee', onSelect }) {
  const heat = pain > 7 ? 'danger' : pain > 4 ? 'kinetic' : 'recovery'
  return (
    <div className="body-rig" aria-label="Interactive athlete body selection">
      <div className="scanline" />
      <svg viewBox="0 0 220 420" className="body-svg" role="img" aria-label="Athlete body heatmap">
        <defs>
          <linearGradient id="bodyGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12a7ff" stopOpacity=".88" />
            <stop offset="54%" stopColor="#35f29b" stopOpacity=".62" />
            <stop offset="100%" stopColor="#ff7a1a" stopOpacity=".5" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="47" r="28" fill="rgba(168,179,199,.16)" stroke="url(#bodyGlow)" strokeWidth="2" />
        <path d="M82 86 C103 72 122 72 141 86 L153 176 L134 232 L145 380 L114 380 L108 258 L101 380 L70 380 L84 232 L66 176 Z" fill="rgba(18, 30, 48, .92)" stroke="url(#bodyGlow)" strokeWidth="3" />
        <path d="M75 112 L32 208 M145 112 L188 208" stroke="rgba(18,167,255,.55)" strokeWidth="17" strokeLinecap="round" />
        <path d="M84 232 L51 335 M135 232 L171 335" stroke="rgba(168,179,199,.22)" strokeWidth="20" strokeLinecap="round" />
        <path d="M48 337 L39 390 M174 337 L183 390" stroke="rgba(18,167,255,.45)" strokeWidth="16" strokeLinecap="round" />
      </svg>
      {bodyParts.map((part) => (
        <button
          key={part.id}
          type="button"
          className={`hotspot ${selected === part.id ? `hotspot-${heat}` : ''}`}
          style={{ left: `${part.x}%`, top: `${part.y}%` }}
          onClick={() => onSelect(part.label)}
          aria-label={`Select ${part.label}`}
        >
          <span>{part.label}</span>
        </button>
      ))}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="input-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function SelectField({ label, value, onChange, options, placeholder = 'Select...' }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </Field>
  )
}

function NumberField({ label, value, onChange, min = 0 }) {
  return (
    <Field label={label}>
      <input min={min} type="number" value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

function Segmented({ label, value, onChange, options }) {
  return (
    <div className="segmented-block">
      <span>{label}</span>
      <div className="chip-row">
        {options.map((option) => (
          <button key={option} type="button" className={value === option ? 'active' : ''} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function BinaryToggle({ label, value, onChange }) {
  return (
    <div className="binary-row">
      <strong>{label}</strong>
      <div>
        {['Yes', 'No'].map((option) => (
          <button key={option} type="button" className={value === option ? 'active' : ''} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function LaunchDeck({ onLaunch }) {
  return (
    <div className="launch-deck" aria-label="AthleteEdge AI tools">
      {modules.map(({ id, title, label, copy, Icon, stat }, index) => (
        <motion.button
          key={id}
          type="button"
          className={`module-button module-${id}`}
          onClick={() => onLaunch(id)}
          initial={{ opacity: 0, y: 26, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.18 + index * 0.08, duration: 0.55 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="module-scan" />
          <span className="module-kicker">{label}</span>
          <Icon size={28} />
          <strong>{title}</strong>
          <small>{copy}</small>
          <em>{stat}</em>
        </motion.button>
      ))}
    </div>
  )
}

function Hero({ onLaunch }) {
  return (
    <section className="hero-section min-h-[100svh] overflow-hidden px-5 pb-24 pt-5 sm:px-8 lg:px-12">
      <motion.div className="stadium-beam beam-a" animate={{ x: [0, 20, -10, 0], opacity: [0.22, 0.4, 0.25] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="stadium-beam beam-b" animate={{ x: [0, -26, 12, 0], opacity: [0.18, 0.34, 0.2] }} transition={{ duration: 7, repeat: Infinity }} />
      <nav className="top-hud">
        <div>
          <span className="brand-mark">AE</span>
          <span>AthleteEdge AI</span>
        </div>
        <span className="mission-pill">Free elite intelligence</span>
      </nav>

      <div className="hero-grid">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-copy">
          <p className="field-label">India / grassroots performance network</p>
          <h1>Every athlete deserves elite guidance.</h1>
          <p className="hero-sub">
            Pick your mission. Injury recovery, performance fuel, or coach-doctor support opens instantly as
            its own focused command page.
          </p>
          <LaunchDeck onLaunch={onLaunch} />
        </motion.div>

        <motion.div className="hero-athlete" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <div className="track-rings" />
          <AthleteSilhouette pain={3} selected="knee" onSelect={() => {}} />
          <div className="telemetry telemetry-one">
            <Activity size={16} /> HRV 72 ms
          </div>
          <div className="telemetry telemetry-two">
            <HeartPulse size={16} /> Recovery 84%
          </div>
          <div className="telemetry telemetry-three">
            <Flame size={16} /> Load +18
          </div>
        </motion.div>
      </div>

      <div className="hero-metrics">
        <MetricTicker label="Akhaada mode" value="Strength block" />
        <MetricTicker label="Kabaddi burst" value="2.1s acceleration" />
        <MetricTicker label="Cricket spell" value="Shoulder load watch" />
      </div>
    </section>
  )
}

function InjuryLab() {
  const [form, setForm] = useState({
    sport: '',
    bodyPart: '',
    painSeverity: 5,
    age: '',
    weight: '',
    trainingDays: '',
    hoursPerWeek: '',
    previousInjury: 'No',
    matchWithin48: 'No',
    description: '',
  })
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const high = form.painSeverity > 7

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function runDiagnostics() {
    setRunning(true)
    setResult(null)
    const data = await postAI('/api/injury', form)
    setResult(data)
    setRunning(false)
  }

  return (
    <section id="injury" className={`lab-section page-section ${high ? 'escalate' : ''}`}>
      <div className="section-intro">
        <p className="field-label">Recovery diagnostic chamber</p>
        <h2>Scan the signal. Protect the athlete.</h2>
      </div>
      <div className="lab-grid">
        <AthleteSilhouette pain={form.painSeverity} selected={(form.bodyPart || 'knee').toLowerCase()} onSelect={(part) => updateForm('bodyPart', part)} />
        <div className="diagnostic-console">
          <div className="console-header">
            <Microscope size={20} />
            <span>{(form.bodyPart || 'BODY').toUpperCase()} PROTOCOL</span>
            {high && <BadgeAlert className="text-alert" size={20} />}
          </div>
          <div className="form-grid">
            <SelectField label="Sport" value={form.sport} onChange={(value) => updateForm('sport', value)} options={sports} />
            <SelectField label="Body Part" value={form.bodyPart} onChange={(value) => updateForm('bodyPart', value)} options={injuryParts} />
          </div>
          <label className="range-field pain-range">
            <span>Pain Severity</span>
            <strong>{form.painSeverity}/10</strong>
            <input min="1" max="10" type="range" value={form.painSeverity} onChange={(e) => updateForm('painSeverity', Number(e.target.value))} />
          </label>
          <div className="form-grid">
            <NumberField label="Age" value={form.age} onChange={(value) => updateForm('age', value)} />
            <NumberField label="Weight (kg)" value={form.weight} onChange={(value) => updateForm('weight', value)} />
            <NumberField label="Training (Days/Wk)" value={form.trainingDays} onChange={(value) => updateForm('trainingDays', value)} />
            <NumberField label="Hours/Week" value={form.hoursPerWeek} onChange={(value) => updateForm('hoursPerWeek', value)} />
          </div>
          <BinaryToggle label="Previous injury in same area?" value={form.previousInjury} onChange={(value) => updateForm('previousInjury', value)} />
          <BinaryToggle label="Match within 48 hours?" value={form.matchWithin48} onChange={(value) => updateForm('matchWithin48', value)} />
          <Field label="Describe your pain">
            <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="E.g., Sharp pain when I bend my knee..." />
          </Field>
          <button className="run-button" type="button" onClick={runDiagnostics}>
            {running ? 'Scanning tissue load' : 'Analyse Injury'} <Zap size={18} />
          </button>
          <AnimatePresence mode="wait">
            {running && (
              <motion.div key="scan" className="scan-sequence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span />
                <p>Biomechanics, swelling risk, mobility loss, return-to-play gates...</p>
              </motion.div>
            )}
            {result && (
              <motion.div key="result" className="result-intel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div>
                  <span>Recovery timeline</span>
                  <strong>{result.timeline}</strong>
                </div>
                <div>
                  <span>Risk status</span>
                  <strong>{result.risk}</strong>
                </div>
                <p><ShieldAlert size={16} /> {result.note}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="drill-strip">
        {recoveryDrills.map((drill, index) => (
          <motion.article key={drill.name} className="drill-card" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}>
            <Play size={17} />
            <h3>{drill.name}</h3>
            <p>{drill.signal}</p>
            <span>{drill.load} / {drill.reps}</span>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function MacroRing({ value, label, color }) {
  return (
    <div className="macro-ring" style={{ '--value': value, '--ring': color }}>
      <div>
        <strong>{value}%</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function NutritionEngine() {
  const [form, setForm] = useState({
    sport: '',
    region: 'North India',
    goal: 'Match Performance',
    age: '',
    weight: '',
    height: '',
    diet: 'Vegetarian',
    trainingPhase: 'Pre-Season',
    budget: 150,
  })
  const [plan, setPlan] = useState(null)

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function generatePlan() {
    const data = await postAI('/api/nutrition', form)
    setPlan(data)
  }

  return (
    <section id="nutrition" className="nutrition-section page-section">
      <div className="section-intro">
        <p className="field-label">Fuel systems / affordable India plan</p>
        <h2>Food that trains with you.</h2>
      </div>
      <div className="fuel-command">
        <div className="fuel-left">
          <div className="form-grid">
            <SelectField label="Sport" value={form.sport} onChange={(value) => updateForm('sport', value)} options={sports} />
            <SelectField label="Region" value={form.region} onChange={(value) => updateForm('region', value)} options={regions} />
          </div>
          <Segmented label="Goal" value={form.goal} onChange={(value) => updateForm('goal', value)} options={nutritionGoals} />
          <div className="form-grid nutrition-metrics">
            <NumberField label="Age" value={form.age} onChange={(value) => updateForm('age', value)} />
            <NumberField label="Weight(kg)" value={form.weight} onChange={(value) => updateForm('weight', value)} />
            <NumberField label="Height(cm)" value={form.height} onChange={(value) => updateForm('height', value)} />
          </div>
          <Segmented label="Diet Preference" value={form.diet} onChange={(value) => updateForm('diet', value)} options={diets} />
          <Segmented label="Training Phase" value={form.trainingPhase} onChange={(value) => updateForm('trainingPhase', value)} options={phases} />
          <label className="range-field budget-range">
            <span>Daily Budget (Rs)</span>
            <strong>Rs {form.budget}</strong>
            <input min="50" max="500" step="10" type="range" value={form.budget} onChange={(e) => updateForm('budget', Number(e.target.value))} />
            <small>Rs 50</small>
            <small>Rs 500</small>
          </label>
          <button className="run-button nutrition-submit" type="button" onClick={generatePlan}>
            Generate Meal Plan <Zap size={18} />
          </button>
          <div className="rings">
            <MacroRing value={62} label="Carb engine" color="#12a7ff" />
            <MacroRing value={28} label="Protein repair" color="#35f29b" />
            <MacroRing value={74} label="Hydration" color="#ff7a1a" />
          </div>
          <div className="fuel-readout">
            <IndianRupee size={18} />
            <span>{plan?.budget || 'Generate a budget-aware plan for field days and hostel routines.'}</span>
          </div>
        </div>
        <div className="meal-timeline">
          {foodPlans.map((food, index) => (
            <motion.div className="meal-node" key={food.time} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }}>
              <time>{food.time}</time>
              <div>
                <span>{food.mode} / {food.cost}</span>
                <h3>{food.meal}</h3>
                <p>{food.macro}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoachTerminal() {
  const [mode, setMode] = useState('coach')
  const [text, setText] = useState('My knee hurts after sprint drills. Can I train tomorrow?')
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi there! I'm your AthleteEdge Assistant. How can I help you improve your game today?" },
  ])
  const [typing, setTyping] = useState(false)

  async function send() {
    if (!text.trim()) return
    const current = text
    setMessages((items) => [...items, { from: 'athlete', text: current }])
    setText('')
    setTyping(true)
    const data = await postAI('/api/chat', { mode, message: current })
    setMessages((items) => [...items, { from: 'ai', text: data.reply }])
    setTyping(false)
  }

  return (
    <section id="coach" className={`coach-section page-section ${mode}`}>
      <div className="terminal-shell">
        <div className="terminal-head">
          <div>
            <p className="field-label">Coach + Doctor communication terminal</p>
            <h2>{mode === 'coach' ? 'Headset on. Pressure managed.' : 'Clinical calm. Athlete safety first.'}</h2>
          </div>
          <div className="switcher">
            <button className={mode === 'coach' ? 'active' : ''} onClick={() => setMode('coach')} type="button"><Dumbbell size={16} /> Coach</button>
            <button className={mode === 'doctor' ? 'active' : ''} onClick={() => setMode('doctor')} type="button"><Stethoscope size={16} /> Doctor</button>
          </div>
        </div>
        <div className="wave-zone">
          {Array.from({ length: 24 }).map((_, index) => (
            <motion.span key={index} animate={{ height: [`${18 + (index % 5) * 8}px`, `${42 + (index % 7) * 7}px`, `${20 + (index % 4) * 9}px`] }} transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.03 }} />
          ))}
        </div>
        <div className="message-feed coach-feed">
          {messages.map((message, index) => (
            <motion.div key={`${message.from}-${index}`} className={`signal ${message.from}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <span>{message.from === 'ai' ? mode.toUpperCase() : 'ATHLETE'}</span>
              <p>{message.text}</p>
            </motion.div>
          ))}
          {typing && <div className="typing-pulse">Analyzing training context...</div>}
        </div>
        <div className="prompt-strip">
          {['How do I recover faster?', 'What to eat before a match?', 'I have knee pain', 'How to improve stamina?', 'First aid for muscle cramps'].map((prompt) => (
            <button key={prompt} type="button" onClick={() => setText(prompt)}>{prompt}</button>
          ))}
        </div>
        <div className="transmit-row">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Transmit your training question" />
          <button onClick={send} type="button"><MessageSquareText size={18} /> Send</button>
        </div>
      </div>
    </section>
  )
}

function StoryBand() {
  return (
    <section className="story-band">
      <div className="story-copy">
        <p className="field-label">Mission lock</p>
        <h2>Built for the athlete training without a support system.</h2>
      </div>
      <div className="mission-grid">
        {[
          ['Tier 2 speed', 'Recovery intelligence for bus rides, school fields, and district meets.', Target],
          ['Rural resilience', 'Budget-aware food and safety guidance without subscription walls.', Apple],
          ['Pressure engine', 'Coach energy when confidence dips and clinical safety when pain spikes.', Brain],
        ].map(([title, copy, Icon]) => (
          <article key={title}>
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function TopBackNav({ activePage, onNavigate }) {
  const current = modules.find((item) => item.id === activePage)
  return (
    <nav className="page-hud">
      <button type="button" onClick={() => onNavigate('home')} className="back-button">
        <ChevronUp size={18} /> Mission
      </button>
      <span>{current?.label || 'AthleteEdge AI'}</span>
    </nav>
  )
}

function BottomNav({ activePage, onNavigate }) {
  return (
    <div className="bottom-nav" aria-label="Primary navigation">
      <button className={activePage === 'home' ? 'active' : ''} onClick={() => onNavigate('home')} type="button"><ChevronUp size={19} /><span>Top</span></button>
      <button className={activePage === 'injury' ? 'active' : ''} onClick={() => onNavigate('injury')} type="button"><Cross size={19} /><span>Injury</span></button>
      <button className={activePage === 'nutrition' ? 'active' : ''} onClick={() => onNavigate('nutrition')} type="button"><Beef size={19} /><span>Fuel</span></button>
      <button className={activePage === 'coach' ? 'active' : ''} onClick={() => onNavigate('coach')} type="button"><Bot size={19} /><span>Coach</span></button>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24 })
  const y = useTransform(scrollYProgress, [0, 1], [0, -160])
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => i), [])
  const isHome = activePage === 'home'

  function navigate(page) {
    setActivePage(page)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  return (
    <main id="top" className="app-shell">
      <motion.div className="progress-line" style={{ scaleX }} />
      <motion.div className="mesh-field" style={{ y }}>
        {particles.map((item) => <span key={item} />)}
      </motion.div>
      {!isHome && <TopBackNav activePage={activePage} onNavigate={navigate} />}
      <AnimatePresence mode="wait">
        {isHome && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.35 }}>
            <Hero onLaunch={navigate} />
            <StoryBand />
            <footer className="final-lock">
              <Sparkles size={18} />
              <span>No login. No ads. No subscription wall. Elite-level sports intelligence for every athlete.</span>
            </footer>
          </motion.div>
        )}
        {activePage === 'injury' && (
          <motion.div key="injury" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            <InjuryLab />
          </motion.div>
        )}
        {activePage === 'nutrition' && (
          <motion.div key="nutrition" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            <NutritionEngine />
          </motion.div>
        )}
        {activePage === 'coach' && (
          <motion.div key="coach" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            <CoachTerminal />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav activePage={activePage} onNavigate={navigate} />
    </main>
  )
}
