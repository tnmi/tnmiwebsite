"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Database, Cpu, BarChart3 } from "lucide-react"

interface DataFlowAnimationProps {
  isInView: boolean
}

export default function DataFlowAnimation({ isInView }: DataFlowAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const dataTypes = [
    { name: "Temperature", value: "23.5°C", color: "#ef4444", delay: 0 },
    { name: "Strain", value: "0.002%", color: "#3b82f6", delay: 0.2 },
    { name: "pH Level", value: "7.2", color: "#10b981", delay: 0.4 },
    { name: "Pressure", value: "101.3 kPa", color: "#8b5cf6", delay: 0.6 },
    { name: "Conductivity", value: "5.2 S/m", color: "#f59e0b", delay: 0.8 },
    { name: "Vibration", value: "0.05g", color: "#06b6d4", delay: 1.0 },
  ]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-emerald-400" />
          ))}
        </div>
      </div>

      {/* Sensor data streams */}
      <div className="absolute inset-0 p-8">
        {/* Left side - Sensors */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2 text-emerald-400" />
              IoT Sensors
            </h4>
            <div className="space-y-2">
              {dataTypes.map((data, index) => (
                <motion.div
                  key={data.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: data.delay }}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-300">{data.name}:</span>
                  <span className="text-white font-mono" style={{ color: data.color }}>
                    {data.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - AI Processing */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-emerald-600 p-6 rounded-full border-4 border-emerald-400 relative"
          >
            <Cpu className="w-12 h-12 text-white" />

            {/* Pulsing rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 border-2 border-emerald-400 rounded-full"
                animate={{
                  scale: [1, 1.5 + ring * 0.3],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: ring * 0.3,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Right side - Insights */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
              AI Insights
            </h4>
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="text-sm"
              >
                <span className="text-emerald-400">Material Health:</span>
                <span className="text-white ml-2">95% Optimal</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.7 }}
                className="text-sm"
              >
                <span className="text-emerald-400">Failure Risk:</span>
                <span className="text-white ml-2">Low (2%)</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.9 }}
                className="text-sm"
              >
                <span className="text-emerald-400">Performance:</span>
                <span className="text-white ml-2">Above Expected</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 2.1 }}
                className="text-sm"
              >
                <span className="text-emerald-400">Maintenance:</span>
                <span className="text-white ml-2">Due in 45 days</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Data flow lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Left to center */}
          {dataTypes.map((data, index) => (
            <motion.line
              key={`left-${index}`}
              x1="25%"
              y1={`${40 + index * 3}%`}
              x2="25%"
              y2={`${40 + index * 3}%`}
              stroke={data.color}
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ x2: "25%" }}
              animate={isInView ? { x2: "47%" } : {}}
              transition={{ duration: 1, delay: data.delay + 1 }}
            />
          ))}

          {/* Center to right */}
          <motion.line
            x1="53%"
            y1="50%"
            x2="53%"
            y2="50%"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8,4"
            initial={{ x2: "53%" }}
            animate={isInView ? { x2: "75%" } : {}}
            transition={{ duration: 1, delay: 2 }}
          />
        </svg>

        {/* Floating data particles */}
        {isInView &&
          Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-emerald-400 rounded-full"
              style={{
                left: "25%",
                top: `${40 + (i % 6) * 3}%`,
              }}
              animate={{
                x: ["0%", "200%", "400%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2 + 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
            />
          ))}
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-emerald-400 font-bold">1.2M</div>
              <div className="text-xs text-slate-400">Data points/hour</div>
            </div>
            <div>
              <div className="text-emerald-400 font-bold">50ms</div>
              <div className="text-xs text-slate-400">Processing latency</div>
            </div>
            <div>
              <div className="text-emerald-400 font-bold">99.9%</div>
              <div className="text-xs text-slate-400">Correlation accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
