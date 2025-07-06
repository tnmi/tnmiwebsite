"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Thermometer, Zap, Activity, Gauge, Beaker, Wifi } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SensorType {
  name: string
  icon: any
  dataTypes: string[]
  applications: string[]
  frequency: string
  accuracy: string
  color: string
}

interface SensorDataShowcaseProps {
  isInView: boolean
}

export default function SensorDataShowcase({ isInView }: SensorDataShowcaseProps) {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)

  const sensorTypes: SensorType[] = [
    {
      name: "Temperature Sensors",
      icon: Thermometer,
      dataTypes: ["Thermal gradients", "Heat distribution", "Thermal cycling", "Phase transitions"],
      applications: ["Battery thermal management", "Concrete curing", "Metal processing"],
      frequency: "1-1000 Hz",
      accuracy: "±0.1°C",
      color: "red",
    },
    {
      name: "Strain Gauges",
      icon: Activity,
      dataTypes: ["Mechanical stress", "Deformation", "Load distribution", "Fatigue cycles"],
      applications: ["Structural monitoring", "Material testing", "Bridge health"],
      frequency: "0.1-10 kHz",
      accuracy: "±0.05%",
      color: "blue",
    },
    {
      name: "Chemical Sensors",
      icon: Beaker,
      dataTypes: ["pH levels", "Ion concentration", "Gas composition", "Corrosion rates"],
      applications: ["Concrete durability", "Battery electrolytes", "Environmental monitoring"],
      frequency: "0.1-100 Hz",
      accuracy: "±1%",
      color: "green",
    },
    {
      name: "Pressure Sensors",
      icon: Gauge,
      dataTypes: ["Hydraulic pressure", "Gas pressure", "Vacuum levels", "Pressure cycles"],
      applications: ["Pipeline monitoring", "Battery swelling", "Manufacturing processes"],
      frequency: "1-1000 Hz",
      accuracy: "±0.25%",
      color: "purple",
    },
    {
      name: "Electrical Sensors",
      icon: Zap,
      dataTypes: ["Conductivity", "Resistance", "Capacitance", "Impedance"],
      applications: ["Battery performance", "Corrosion detection", "Material characterization"],
      frequency: "DC-1 MHz",
      accuracy: "±0.1%",
      color: "yellow",
    },
    {
      name: "Vibration Sensors",
      icon: Wifi,
      dataTypes: ["Acceleration", "Velocity", "Displacement", "Frequency spectrum"],
      applications: ["Predictive maintenance", "Structural health", "Equipment monitoring"],
      frequency: "0.1-20 kHz",
      accuracy: "±2%",
      color: "cyan",
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: "bg-red-500 text-red-600 border-red-200",
      blue: "bg-blue-500 text-blue-600 border-blue-200",
      green: "bg-green-500 text-green-600 border-green-200",
      purple: "bg-purple-500 text-purple-600 border-purple-200",
      yellow: "bg-yellow-500 text-yellow-600 border-yellow-200",
      cyan: "bg-cyan-500 text-cyan-600 border-cyan-200",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">IoT Sensor Integration</h3>
      <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
        Our platform processes real-time data from diverse sensor networks, correlating physical measurements with
        material performance predictions.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {sensorTypes.map((sensor, index) => (
          <motion.div
            key={sensor.name}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setSelectedSensor(sensor.name)}
            onMouseLeave={() => setSelectedSensor(null)}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedSensor === sensor.name ? "ring-2 ring-emerald-400 shadow-lg" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${getColorClasses(sensor.color).split(" ")[0]}/10`}>
                    <sensor.icon className={`w-6 h-6 ${getColorClasses(sensor.color).split(" ")[1]}`} />
                  </div>
                  <h4 className="font-semibold text-slate-900">{sensor.name}</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Frequency</span>
                    <p className="text-sm text-slate-700">{sensor.frequency}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Accuracy</span>
                    <p className="text-sm text-slate-700">{sensor.accuracy}</p>
                  </div>
                </div>

                {selectedSensor === sensor.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-slate-200"
                  >
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Data Types</span>
                        <div className="mt-1 space-y-1">
                          {sensor.dataTypes.map((type, typeIndex) => (
                            <div key={typeIndex} className="flex items-center space-x-2">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${getColorClasses(sensor.color).split(" ")[0]}`}
                              />
                              <span className="text-xs text-slate-600">{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Applications</span>
                        <div className="mt-1 space-y-1">
                          {sensor.applications.map((app, appIndex) => (
                            <div key={appIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span className="text-xs text-slate-600">{app}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Real-time data processing stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 rounded-lg text-white"
      >
        <h4 className="text-xl font-bold mb-4 text-center">Real-Time Processing Capabilities</h4>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold">2.5TB</div>
            <p className="text-sm text-emerald-100">Daily sensor data processed</p>
          </div>
          <div>
            <div className="text-3xl font-bold">50ms</div>
            <p className="text-sm text-emerald-100">Average response time</p>
          </div>
          <div>
            <div className="text-3xl font-bold">99.9%</div>
            <p className="text-sm text-emerald-100">Data correlation accuracy</p>
          </div>
          <div>
            <div className="text-3xl font-bold">24/7</div>
            <p className="text-sm text-emerald-100">Continuous monitoring</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
