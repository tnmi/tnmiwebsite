"use client"

import { motion } from "framer-motion"
import { Thermometer, Zap, Activity, Gauge, Beaker, Wifi, Building, Wrench, Leaf } from "lucide-react"

interface SubCoreAnimationProps {
  type: string
  isVisible: boolean
}

export function SubCoreAnimation({ type, isVisible }: SubCoreAnimationProps) {
  switch (type) {
    case "iot-sensors":
      return <IoTSensorAnimation isVisible={isVisible} />
    case "predictive-maintenance":
      return <PredictiveMaintenanceAnimation isVisible={isVisible} />
    case "biochar-concrete":
      return <BiocharConcreteAnimation isVisible={isVisible} />
    case "graphene-batteries":
      return <GrapheneBatteryAnimation isVisible={isVisible} />
    case "green-concrete":
      return <GreenConcreteAnimation isVisible={isVisible} />
    default:
      return <DefaultAnimation isVisible={isVisible} />
  }
}

function IoTSensorAnimation({ isVisible }: { isVisible: boolean }) {
  const sensors = [
    { icon: Thermometer, color: "#ef4444", name: "Temperature", value: "23.5°C" },
    { icon: Activity, color: "#3b82f6", name: "Strain", value: "0.002%" },
    { icon: Beaker, color: "#10b981", name: "pH", value: "7.2" },
    { icon: Gauge, color: "#8b5cf6", name: "Pressure", value: "101.3 kPa" },
    { icon: Zap, color: "#f59e0b", name: "Conductivity", value: "5.2 S/m" },
    { icon: Wifi, color: "#06b6d4", name: "Vibration", value: "0.05g" },
  ]

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-6 gap-2 p-4">
        {sensors.map((sensor, index) => (
          <motion.div
            key={sensor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-slate-700 p-2 rounded text-center"
          >
            <sensor.icon className="w-4 h-4 mx-auto mb-1" style={{ color: sensor.color }} />
            <div className="text-xs text-white font-mono">{sensor.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Data flow lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {isVisible &&
          sensors.map((_, index) => (
            <motion.line
              key={index}
              x1={`${(index + 0.5) * 16.67}%`}
              y1="80%"
              x2="50%"
              y2="95%"
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            />
          ))}
      </svg>
    </div>
  )
}

function PredictiveMaintenanceAnimation({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg overflow-hidden">
      {/* Equipment representation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center"
        >
          <Wrench className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Health indicators */}
      <div className="absolute right-4 top-4 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-green-500 px-3 py-1 rounded text-xs text-white"
        >
          Health: 95%
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-yellow-500 px-3 py-1 rounded text-xs text-white"
        >
          Maintenance: 45 days
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-red-500 px-3 py-1 rounded text-xs text-white"
        >
          Risk: Low (2%)
        </motion.div>
      </div>

      {/* Sensor signals */}
      {isVisible &&
        Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{ left: "20%", top: "50%" }}
            animate={{
              x: [0, 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          />
        ))}
    </div>
  )
}

function BiocharConcreteAnimation({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-green-800 to-emerald-800 rounded-lg overflow-hidden">
      {/* Concrete blocks */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-400 rounded-t-lg">
        <div className="grid grid-cols-8 h-full gap-1 p-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-500 rounded"
            />
          ))}
        </div>
      </div>

      {/* Carbon particles being absorbed */}
      {isVisible &&
        Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-black rounded-full"
            style={{
              left: `${10 + i * 7}%`,
              top: "10%",
            }}
            animate={{
              y: [0, 60],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          />
        ))}

      {/* CO2 reduction indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-xs text-white flex items-center"
      >
        <Leaf className="w-3 h-3 mr-1" />
        -30% CO₂
      </motion.div>
    </div>
  )
}

function GrapheneBatteryAnimation({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-yellow-800 to-orange-800 rounded-lg overflow-hidden">
      {/* Battery outline */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-12 border-2 border-white rounded-sm relative">
          <div className="absolute -right-1 top-2 w-1 h-8 bg-white rounded-r"></div>

          {/* Battery fill animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: "100%" } : {}}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-sm"
          />
        </div>
      </div>

      {/* Graphene layers */}
      <div className="absolute left-4 top-4 space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="w-8 h-1 bg-gray-300 rounded"
          />
        ))}
      </div>

      {/* Performance indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-4 right-4 text-right"
      >
        <div className="text-xs text-yellow-200">Fast Charge: 5min</div>
        <div className="text-xs text-yellow-200">Lifespan: +300%</div>
      </motion.div>
    </div>
  )
}

function GreenConcreteAnimation({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg overflow-hidden">
      {/* Building silhouette */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex items-end justify-center space-x-2 h-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={isVisible ? { height: `${40 + i * 8}px` } : {}}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="bg-gray-500 w-8 rounded-t"
            />
          ))}
        </div>
      </div>

      {/* Green elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-4 left-4 bg-green-500 px-2 py-1 rounded text-xs text-white"
      >
        LEED Certified
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute top-4 right-4 bg-blue-500 px-2 py-1 rounded text-xs text-white"
      >
        50% Less Water
      </motion.div>
    </div>
  )
}

function DefaultAnimation({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
          <Building className="w-8 h-8 text-white" />
        </div>
      </motion.div>
    </div>
  )
}

// Export the SubCoreAnimation as the default export
export default SubCoreAnimation
