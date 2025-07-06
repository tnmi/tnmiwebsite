import React, { useState, useEffect } from 'react';

const Diagram = () => {
  const [hoveredCore, setHoveredCore] = useState(null);
  const [activeConnections, setActiveConnections] = useState([]);
  const [agenticFlow, setAgenticFlow] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [activeTab, setActiveTab] = useState('Template');

  const tabs = [
    { 
      id: 'Template', 
      name: 'Template', 
      centralCore: { 
        name: 'ORCHESTRAL', 
        icon: '🎼', 
        description: 'The central agentic AI hub that coordinates and optimizes all processing cores through real-time data integration and proactive decision-making.' 
      } 
    },
    { 
      id: 'Carbon', 
      name: 'Carbon', 
      centralCore: { 
        name: 'CABAL', 
        icon: '⚫', 
        description: 'Carbon Agentic Business Analytics Lab - specialized AI coordination for carbon material processing, optimization, and lifecycle management.' 
      } 
    },
    { 
      id: 'Lithium', 
      name: 'Lithium', 
      centralCore: { 
        name: 'LABAL', 
        icon: '🔋', 
        description: 'Lithium Agentic Business Analytics Lab - dedicated AI orchestration for lithium extraction, processing, and battery material optimization.' 
      } 
    },
    { 
      id: 'Nickel', 
      name: 'Nickel', 
      centralCore: { 
        name: 'NABAL', 
        icon: '🔩', 
        description: 'Nickel Agentic Business Analytics Lab - specialized AI coordination for nickel mining, refining, and high-performance alloy development.' 
      } 
    },
    { 
      id: 'Copper', 
      name: 'Copper', 
      centralCore: { 
        name: 'CuABAL', 
        icon: '🟫', 
        description: 'Copper Agentic Business Analytics Lab - dedicated AI orchestration for copper extraction, purification, and electrical component optimization.' 
      } 
    },
    { 
      id: 'Steel', 
      name: 'Steel', 
      centralCore: { 
        name: 'SABAL', 
        icon: '🔧', 
        description: 'Steel Agentic Business Analytics Lab - specialized AI coordination for iron ore processing, steel production, and advanced metallurgy optimization.' 
      } 
    }
  ];

  const getCurrentCentralCore = () => {
    return tabs.find(tab => tab.id === activeTab)?.centralCore || tabs[0].centralCore;
  };

  const cores = [
    {
      id: 'geo',
      name: 'GeoCORE',
      purpose: 'Agentic AI understanding where raw materials come from and the macro-dynamics of sourcing them',
      position: { x: 50, y: 15 },
      color: '#A9C6F5',
      icon: '🌍',
      dataSources: [
        { x: 65, y: 25, label: 'Geological Data' },
        { x: 70, y: 8, label: 'Indigenous OCAP' },
        { x: 45, y: 25, label: 'Feedstock Analysis' }
      ]
    },
    {
      id: 'extraction',
      name: 'ExtractionCORE', 
      purpose: 'Agentic AI understanding how to efficiently and consistently extract material from raw inputs',
      position: { x: 85, y: 35 },
      color: '#1ED9A1',
      icon: '⛏️',
      dataSources: [
        { x: 95, y: 25, label: 'Processing Library' },
        { x: 90, y: 45, label: 'Equipment Specs' },
        { x: 75, y: 20, label: 'Time-Series Data' }
      ]
    },
    {
      id: 'foundry',
      name: 'FoundryCORE',
      purpose: 'Agentic AI designing the final product by mixing core material with other components',
      position: { x: 85, y: 65 },
      color: '#60D4FF',
      icon: '🔥',
      dataSources: [
        { x: 95, y: 55, label: 'Material Specs' },
        { x: 90, y: 75, label: 'Partner Requirements' },
        { x: 75, y: 80, label: 'Materials Informatics' }
      ]
    },
    {
      id: 'manufacturing',
      name: 'ManufacturingCORE',
      purpose: 'Agentic AI understanding the factory that will produce the formulated product',
      position: { x: 50, y: 85 },
      color: '#8BBFF0',
      icon: '🏭',
      dataSources: [
        { x: 30, y: 95, label: '3D Factory Design' },
        { x: 70, y: 92, label: 'Funding Matches' },
        { x: 55, y: 75, label: 'Equipment Specs' }
      ]
    },
    {
      id: 'optimization',
      name: 'OptimizationCORE',
      purpose: 'Agentic AI optimizing the factory to run smarter, cheaper, and more reliably through IoT sensors',
      position: { x: 15, y: 65 },
      color: '#5EF6D2',
      icon: '⚡',
      dataSources: [
        { x: 5, y: 55, label: 'CMMS Data' },
        { x: 10, y: 75, label: 'IoT Sensors' },
        { x: 25, y: 80, label: 'Demand History' }
      ]
    },
    {
      id: 'circular',
      name: 'CircularCORE',
      purpose: 'Agentic AI planning for the product\'s entire lifecycle, from use to reuse',
      position: { x: 15, y: 35 },
      color: '#A3C1AD',
      icon: '♻️',
      dataSources: [
        { x: 5, y: 25, label: 'Lifecycle Databases' },
        { x: 10, y: 45, label: 'Degradation Data' },
        { x: 25, y: 20, label: 'Company Profiles' }
      ]
    }
  ];

  const connections = [
    // PRIMARY ESSENTIAL CONNECTIONS - More prominent display
    { from: 'geo', to: 'orchestral', description: 'Mineral discovery coordination', priority: 'high' },
    { from: 'extraction', to: 'foundry', description: 'Material preparation for design', priority: 'high' },
    { from: 'manufacturing', to: 'orchestral', description: 'Production planning coordination', priority: 'high' },
    { from: 'optimization', to: 'circular', description: 'Lifecycle optimization planning', priority: 'high' },
    
    // Bidirectional versions of essential connections
    { from: 'orchestral', to: 'geo', description: 'Strategic mineral guidance', priority: 'high' },
    { from: 'foundry', to: 'extraction', description: 'Material requirements feedback', priority: 'high' },
    { from: 'orchestral', to: 'manufacturing', description: 'Production coordination', priority: 'high' },
    { from: 'circular', to: 'optimization', description: 'End-of-life optimization', priority: 'high' },
    
    // Additional Orchestral connections for complete hub
    { from: 'extraction', to: 'orchestral', description: 'Processing optimization coordination' },
    { from: 'foundry', to: 'orchestral', description: 'Product design coordination' },
    { from: 'optimization', to: 'orchestral', description: 'Performance optimization coordination' },
    { from: 'circular', to: 'orchestral', description: 'Sustainability coordination' },
    
    // Hexagonal neighbor connections
    { from: 'geo', to: 'extraction', description: 'Raw material sourcing to extraction' },
    { from: 'foundry', to: 'manufacturing', description: 'Design to production handoff' },
    { from: 'manufacturing', to: 'optimization', description: 'Factory optimization integration' },
    { from: 'circular', to: 'geo', description: 'Circular sourcing strategies' },
    
    // Additional neighbor connections
    { from: 'extraction', to: 'geo', description: 'Extraction feedback to sourcing' },
    { from: 'manufacturing', to: 'foundry', description: 'Production constraints feedback' },
    { from: 'optimization', to: 'manufacturing', description: 'Real-time factory optimization' },
    { from: 'geo', to: 'circular', description: 'Sustainability planning integration' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomConnection = connections[Math.floor(Math.random() * connections.length)];
      setActiveConnections(prev => {
        const newActive = [...prev, randomConnection];
        return newActive.slice(-2);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (coreId) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoveredCore(coreId);
    
    if (coreId !== 'orchestral') {
      setAgenticFlow({ coreId, phase: 'gathering' });
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCore(null);
      setAgenticFlow(null);
    }, 100);
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    if (agenticFlow && agenticFlow.phase === 'gathering') {
      const timer = setTimeout(() => {
        setAgenticFlow(prev => prev ? { ...prev, phase: 'processing' } : null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [agenticFlow]);

  const getCorePosition = (core) => ({
    left: `${core.position.x}%`,
    top: `${core.position.y}%`
  });

  const getConnectionPath = (fromCore, toCore) => {
    const from = fromCore === 'orchestral' ? { position: { x: 50, y: 50 } } : cores.find(c => c.id === fromCore);
    const to = toCore === 'orchestral' ? { position: { x: 50, y: 50 } } : cores.find(c => c.id === toCore);
    
    return {
      x1: from.position.x,
      y1: from.position.y,
      x2: to.position.x,
      y2: to.position.y
    };
  };

return (
<div>
<div className="text-center">
          {/* Tab Navigation */}
          
          
          {/* Title */}
          <h1 className="text-4xl font-semibold tracking-tight mb-3" style={{ color: '#FFFFFF' }}>
            {getCurrentCentralCore().name} Core System
          </h1>
          <p className="text-base leading-relaxed text-gray-300">
            Integrated intelligence for advanced material optimization through agentic AI
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-0.5 mb-4 p-0.5 rounded-lg mx-auto w-max" style={{ backgroundColor: '#2B3340', border: '1px solid #5EF6D2' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${tab.id === 'Steel' ? 'pl-2 pr-0' : 'px-2'} py-1.5 rounded text-xs font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-black' 
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#1ED9A1' : 'transparent',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(30, 217, 161, 0.4)' : 'none',
                  minWidth: '60px'
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

    <div 
      className="w-full h-screen flex flex-col lg:flex-row overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, #000080 0%, #1A2735 50%, #13181F 100%)`,
        fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      
      {/* Left Half - Animation */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative">
        {/* Clean, Sleek Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle ambient light gradients */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 20%, #5EF6D220 0%, transparent 50%), 
                           radial-gradient(circle at 70% 80%, #60D4FF15 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #1ED9A115 0%, transparent 70%)`
            }}
          />
          
          {/* Minimal geometric lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5EF6D2" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            
            {/* Subtle geometric pattern */}
            <g stroke="url(#bgGradient)" strokeWidth="0.5" fill="none">
              <circle cx="20%" cy="20%" r="100" />
              <circle cx="80%" cy="80%" r="150" />
              <circle cx="70%" cy="30%" r="80" />
              <line x1="0%" y1="100%" x2="100%" y2="0%" strokeDasharray="10,20" />
              <line x1="0%" y1="0%" x2="100%" y2="100%" strokeDasharray="15,30" />
            </g>
          </svg>
        </div>

        {/* Minimal, Beautiful Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5EF6D2" stopOpacity="0.4"/>
              <stop offset="50%" stopColor="#60D4FF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#5EF6D2" stopOpacity="0.4"/>
            </linearGradient>
            
            <linearGradient id="orchestralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1ED9A1" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#5EF6D2" stopOpacity="0.6"/>
            </linearGradient>
            
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5EF6D2" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#1ED9A1" stopOpacity="1"/>
              <stop offset="100%" stopColor="#5EF6D2" stopOpacity="0.8"/>
            </linearGradient>
            
            <linearGradient id="priorityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1ED9A1" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#5EF6D2" stopOpacity="1"/>
              <stop offset="100%" stopColor="#1ED9A1" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          
          {connections.map((conn, idx) => {
            const path = getConnectionPath(conn.from, conn.to);
            const isActive = activeConnections.some(ac => ac.from === conn.from && ac.to === conn.to);
            const isToOrchestral = conn.to === 'orchestral' || conn.from === 'orchestral';
            const isPriority = conn.priority === 'high';
            
            return (
              <g key={`${conn.from}-${conn.to}`}>
                {/* Main connection line */}
                <line
                  x1={path.x1}
                  y1={path.y1}
                  x2={path.x2}
                  y2={path.y2}
                  stroke={isPriority ? "url(#priorityGradient)" : (isToOrchestral ? "url(#orchestralGradient)" : "url(#connectionGradient)")}
                  strokeWidth={isPriority ? "0.5" : (isToOrchestral ? "0.3" : "0.2")}
                  opacity={isPriority ? "0.9" : (isActive ? "1" : (isToOrchestral ? "0.7" : "0.4"))}
                  strokeLinecap="round"
                />
                
                {/* Priority connection enhancement */}
                {isPriority && (
                  <line
                    x1={path.x1}
                    y1={path.y1}
                    x2={path.x2}
                    y2={path.y2}
                    stroke="#1ED9A1"
                    strokeWidth="0.3"
                    opacity="0.6"
                    strokeDasharray="3,2"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-5"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </line>
                )}
                
                {/* Active connection enhancement */}
                {isActive && (
                  <g>
                    {/* Subtle flowing effect */}
                    <line
                      x1={path.x1}
                      y1={path.y1}
                      x2={path.x2}
                      y2={path.y2}
                      stroke="url(#activeGradient)"
                      strokeWidth="0.4"
                      strokeDasharray="2,3"
                      opacity="0.8"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-5"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>
                    
                    {/* Single elegant data pulse */}
                    <circle 
                      r="0.4" 
                      fill="#5EF6D2" 
                      opacity="0.9"
                    >
                      <animateMotion 
                        dur="4s" 
                        repeatCount="indefinite"
                      >
                        <mpath>
                          <path d={`M ${path.x1} ${path.y1} L ${path.x2} ${path.y2}`} />
                        </mpath>
                      </animateMotion>
                    </circle>
                  </g>
                )}
                
                {/* Clean endpoint dots */}
                <circle
                  cx={path.x1}
                  cy={path.y1}
                  r={isPriority ? "0.4" : "0.3"}
                  fill={isPriority ? "#1ED9A1" : (isToOrchestral ? "#1ED9A1" : "#5EF6D2")}
                  opacity={isPriority ? "1" : (isActive ? "0.9" : "0.5")}
                />
                <circle
                  cx={path.x2}
                  cy={path.y2}
                  r={isPriority ? "0.4" : "0.3"}
                  fill={isPriority ? "#1ED9A1" : (isToOrchestral ? "#1ED9A1" : "#60D4FF")}
                  opacity={isPriority ? "1" : (isActive ? "0.9" : "0.5")}
                />
              </g>
            );
          })}
          
          {/* Minimal Agentic Flow */}
          {agenticFlow && (
            <g>
              {cores.find(c => c.id === agenticFlow.coreId)?.dataSources.map((source, idx) => {
                const core = cores.find(c => c.id === agenticFlow.coreId);
                const opacity = agenticFlow.phase === 'gathering' ? 0.8 : 0.6;
                
                return (
                  <g key={`agentic-${idx}`}>
                    {/* Clean agentic line */}
                    <line
                      x1={core.position.x}
                      y1={core.position.y}
                      x2={source.x}
                      y2={source.y}
                      stroke="#5EF6D2"
                      strokeWidth="0.15"
                      opacity={opacity}
                      strokeLinecap="round"
                      strokeDasharray={agenticFlow.phase === 'gathering' ? "1,1" : "none"}
                    >
                      {agenticFlow.phase === 'gathering' && (
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;-2"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      )}
                    </line>
                    
                    {/* Simple data source node */}
                    <circle
                      cx={source.x}
                      cy={source.y}
                      r="0.4"
                      fill="#60D4FF"
                      opacity={opacity}
                    />
                    
                    {/* Minimal data source labels */}
                    <text
                      x={source.x}
                      y={source.y - 1.2}
                      textAnchor="middle"
                      fontSize="1"
                      fill="#5EF6D2"
                      opacity="0.7"
                      style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: '500' }}
                    >
                      {source.label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Central Orchestral Core */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="relative">
            {/* Backdrop glow */}
            <div 
              className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                top: '50%',
                width: '160px',
                height: '160px',
                background: `radial-gradient(circle, rgba(30, 217, 161, 0.3) 0%, rgba(94, 246, 210, 0.2) 40%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(8px)',
                zIndex: -1
              }}
            />
            
            {/* Outer shadow hexagon */}
            <div 
              className="absolute w-40 h-40 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                top: '50%',
                background: `linear-gradient(135deg, rgba(30, 217, 161, 0.4) 0%, rgba(94, 246, 210, 0.3) 100%)`,
                clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                filter: 'blur(2px)',
                zIndex: -1
              }}
            />
            
            {/* Main hexagon */}
            <div 
              className="w-36 h-36 cursor-pointer flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, #1ED9A1 0%, #5EF6D2 50%, #1ED9A1 100%)`,
                clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                boxShadow: `
                  0 0 0 2px rgba(94, 246, 210, 0.8),
                  0 4px 12px rgba(30, 217, 161, 0.6),
                  0 8px 24px rgba(30, 217, 161, 0.4),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                `,
                transform: hoveredCore === 'orchestral' ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={() => handleMouseEnter('orchestral')}
              onMouseLeave={handleMouseLeave}
            >
              {/* Inner highlight */}
              <div 
                className="absolute inset-2"
                style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)`,
                  clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                  pointerEvents: 'none'
                }}
              />
              
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">{getCurrentCentralCore().icon}</div>
                <div 
                  className="text-sm font-bold tracking-wider drop-shadow-sm"
                  style={{ color: '#13181F', textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
                >
                  {getCurrentCentralCore().name}
                </div>
              </div>
              
              {hoveredCore === 'orchestral' && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                    clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Core Hexagons */}
        {cores.map((core, index) => (
          <div
            key={core.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={getCorePosition(core)}
          >
            <div className="relative">
              {/* Backdrop glow */}
              <div 
                className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '140px',
                  height: '140px',
                  background: `radial-gradient(circle, ${core.color}40 0%, ${core.color}20 40%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(6px)',
                  zIndex: -1
                }}
              />
              
              {/* Outer shadow hexagon */}
              <div 
                className="absolute w-32 h-32 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: '50%',
                  top: '50%',
                  background: `linear-gradient(135deg, ${core.color}60 0%, ${core.color}40 100%)`,
                  clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                  filter: 'blur(1px)',
                  zIndex: -1
                }}
              />
              
              {/* Main hexagon */}
              <div
                className="w-28 h-28 cursor-pointer flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${core.color} 0%, ${core.color}DD 50%, ${core.color} 100%)`,
                  clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                  boxShadow: `
                    0 0 0 1px ${core.color}CC,
                    0 3px 8px ${core.color}60,
                    0 6px 16px ${core.color}40,
                    inset 0 2px 4px rgba(255, 255, 255, 0.25),
                    inset 0 -2px 4px rgba(0, 0, 0, 0.15)
                  `,
                  transform: hoveredCore === core.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={() => handleMouseEnter(core.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Inner highlight */}
                <div 
                  className="absolute inset-2"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)`,
                    clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                    pointerEvents: 'none'
                  }}
                />
                
                <div className="text-center relative z-10">
                  <div className="text-2xl mb-1 drop-shadow-lg">{core.icon}</div>
                  <div 
                    className="text-xs font-bold tracking-wide drop-shadow-sm"
                    style={{ color: '#13181F', textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
                  >
                    {core.name.replace('CORE', '')}
                  </div>
                </div>
                
                {hoveredCore === core.id && (
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                      clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Half - Information Panel */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full p-8 flex items-center justify-center">
        <div 
          className="w-full max-w-lg h-5/6 rounded-3xl p-10 lg:p-12 overflow-y-auto border border-white/10 shadow-2xl backdrop-blur-2xl bg-white/5"
        >
          {hoveredCore ? (
            hoveredCore === 'orchestral' ? (
              <div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#1ED9A1' }}>
                  {getCurrentCentralCore().icon} {getCurrentCentralCore().name} Core
                </h3>
                <p className="mb-6 text-lg leading-relaxed" style={{ color: '#A3C1AD' }}>
                  {getCurrentCentralCore().description}
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-3" style={{ color: '#5EF6D2' }}>🤖 AI Orchestration</h4>
                    <ul className="space-y-2 text-base" style={{ color: '#A3C1AD' }}>
                      <li>• Autonomous data integration across all cores</li>
                      <li>• Predictive decision-making algorithms</li>
                      <li>• Multi-core coordination and optimization</li>
                      <li>• Real-time performance monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-3" style={{ color: '#60D4FF' }}>🔄 Core Coordination</h4>
                    <ul className="space-y-2 text-base" style={{ color: '#A3C1AD' }}>
                      <li>• Inter-agent communication protocols</li>
                      <li>• Dynamic resource allocation</li>
                      <li>• Strategic planning optimization</li>
                      <li>• Cross-platform intelligence sharing</li>
                    </ul>
                  </div>
                  {activeTab !== 'Template' && (
                    <div>
                      <h4 className="text-xl font-semibold mb-3" style={{ color: '#1ED9A1' }}>
                        🎯 {activeTab} Specialization
                      </h4>
                      <ul className="space-y-2 text-base" style={{ color: '#A3C1AD' }}>
                        {activeTab === 'Carbon' && (
                          <>
                            <li>• Carbon material processing optimization</li>
                            <li>• Graphene and carbon fiber production</li>
                            <li>• Carbon capture and utilization</li>
                            <li>• Advanced carbon composite design</li>
                          </>
                        )}
                        {activeTab === 'Lithium' && (
                          <>
                            <li>• Lithium extraction and purification</li>
                            <li>• Battery material optimization</li>
                            <li>• Cathode and anode development</li>
                            <li>• Battery recycling and lifecycle</li>
                          </>
                        )}
                        {activeTab === 'Nickel' && (
                          <>
                            <li>• Nickel sulfide ore processing</li>
                            <li>• Stainless steel alloy optimization</li>
                            <li>• High-temperature catalyst development</li>
                            <li>• Nickel-based superalloy design</li>
                          </>
                        )}
                        {activeTab === 'Copper' && (
                          <>
                            <li>• Copper concentrate processing</li>
                            <li>• Electrical conductivity optimization</li>
                            <li>• Copper wire and cable production</li>
                            <li>• Anti-corrosion treatment systems</li>
                          </>
                        )}
                        {activeTab === 'Steel' && (
                          <>
                            <li>• Iron ore beneficiation and pelletizing</li>
                            <li>• Blast furnace optimization</li>
                            <li>• Steel alloy composition design</li>
                            <li>• Advanced metallurgy and heat treatment</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              (() => {
                const core = cores.find(c => c.id === hoveredCore);
                return core ? (
                  <div>
                    <h3 className="text-3xl font-bold mb-4" style={{ color: '#1ED9A1' }}>
                      {core.icon} {core.name} 🤖
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed" style={{ color: '#A3C1AD' }}>{core.purpose}</p>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold mb-3" style={{ color: core.color }}>🎯 AI Capabilities</h4>
                        <div className="text-base" style={{ color: '#A3C1AD' }}>
                          {core.id === 'geo' && (
                            <ul className="space-y-2">
                              <li>• <strong>90% accuracy</strong> in mineral mapping using Random Forest & Support Vector algorithms</li>
                              <li>• <strong>50% reduction</strong> in time to identify critical mineral deposits</li>
                              <li>• <strong>25x success rate</strong> improvement in exploration efficiency</li>
                              <li>• Advanced NLP processing of Indigenous geological insights</li>
                            </ul>
                          )}
                          {core.id === 'extraction' && (
                            <ul className="space-y-2">
                              <li>• <strong>90% accuracy</strong> in predictive tailings chemistry analysis</li>
                              <li>• <strong>+5% recovery rates</strong> through economic recovery optimization</li>
                              <li>• <strong>22% energy reduction</strong> with advanced process optimization</li>
                              <li>• <strong>96% accuracy</strong> for drilling cost predictions</li>
                            </ul>
                          )}
                          {core.id === 'foundry' && (
                            <ul className="space-y-2">
                              <li>• <strong>90% time-to-market reduction</strong> from 20 years to months</li>
                              <li>• <strong>$10,000+ literature value</strong> through automated research</li>
                              <li>• Advanced PSPP (Process-Structure-Property-Performance) modeling</li>
                              <li>• <strong>$100k-$50M savings</strong> on materials research investments</li>
                            </ul>
                          )}
                          {core.id === 'manufacturing' && (
                            <ul className="space-y-2">
                              <li>• <strong>25% reduced CAPEX spend</strong> through optimized factory design</li>
                              <li>• <strong>40% faster commissions</strong> with digital twin technology</li>
                              <li>• <strong>90% accuracy</strong> in bottleneck detection systems</li>
                              <li>• <strong>+20% yields</strong> with Industry 4.0 digital twins</li>
                            </ul>
                          )}
                          {core.id === 'optimization' && (
                            <ul className="space-y-2">
                              <li>• <strong>40% reduction in downtime</strong> through predictive maintenance</li>
                              <li>• <strong>+25% Overall Equipment Effectiveness</strong> (OEE) improvement</li>
                              <li>• <strong>18% energy cost reduction</strong> via IoT-enabled manufacturing</li>
                              <li>• <strong>50% scrap reduction</strong> through real-time monitoring</li>
                            </ul>
                          )}
                          {core.id === 'circular' && (
                            <ul className="space-y-2">
                              <li>• Advanced end-of-life scenario modeling ($106-320/tonne waste management)</li>
                              <li>• <strong>$200,000+ savings</strong> in solid waste management costs</li>
                              <li>• Comprehensive carbon footprint and environmental impact reporting</li>
                              <li>• Waste-to-Energy revenue streams ($2-4/tonne processed)</li>
                            </ul>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-3" style={{ color: core.color }}>📊 AI Data Sources</h4>
                        <div className="text-base" style={{ color: '#A3C1AD' }}>
                          {core.dataSources.map((source, idx) => (
                            <div key={idx} className="mb-2 p-2 rounded" style={{ backgroundColor: '#1A2735' }}>
                              <strong>• {source.label}</strong>
                            </div>
                          ))}
                          {agenticFlow && agenticFlow.coreId === core.id && (
                            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#1A2735', border: '1px solid #5EF6D2' }}>
                              <div className="text-base font-semibold" style={{ color: '#5EF6D2' }}>
                                🤖 AI Agent Status: {agenticFlow.phase === 'gathering' ? 'Gathering data from sources...' : 'Processing information with AI algorithms...'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">{getCurrentCentralCore().icon}</div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#1ED9A1' }}>
                  {getCurrentCentralCore().name} Core System
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#A3C1AD' }}>
                  Hover over any core on the left to explore detailed information about its agentic AI capabilities, performance metrics, and data sources.
                </p>
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#1A2735' }}>
                  <p className="text-base" style={{ color: '#5EF6D2' }}>
                    💡 Interactive AI Workflow Visualization
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#A3C1AD' }}>
                    Watch how each AI agent gathers data from multiple sources to deliver optimized results
                  </p>
                  {activeTab !== 'Template' && (
                    <p className="text-sm mt-2" style={{ color: '#1ED9A1' }}>
                      🎯 Currently viewing: {activeTab} material specialization
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Diagram;