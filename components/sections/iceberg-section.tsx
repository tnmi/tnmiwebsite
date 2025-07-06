import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cpu, Database, FlaskConical, Lightbulb, Sparkles } from 'lucide-react';

const IcebergVisualization = () => {
  // 'revealed' triggers the animation and blur transitions, but does NOT expand or add new content
  const [revealed, setRevealed] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [scannerPosition, setScannerPosition] = useState(0);
  const [revealExpert, setRevealExpert] = useState(false);
  const [revealHidden, setRevealHidden] = useState(false);

  // Scanner animation
  useEffect(() => {
    if (revealed) {
      setRevealExpert(false);
      setRevealHidden(false);
      const startTime = Date.now();
      const duration = 3000; // 3 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Scanner moves from top (320px) to bottom (1000px)
        const currentPosition = 320 + (680 * progress);
        setScannerPosition(currentPosition);
        if (currentPosition >= 620 && !revealExpert) setRevealExpert(true);
        if (currentPosition >= 780 && !revealHidden) setRevealHidden(true);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    } else {
      setScannerPosition(0);
      setRevealExpert(false);
      setRevealHidden(false);
    }
  }, [revealed]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      height: '1120px',
      margin: '0 auto',
      background: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 30%, #111827 60%, #1e3a8a 100%)',
      borderRadius: '24px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
      paddingTop: '0px', // Reduce space between AI-Powered Discovery and iceberg
    }}>
      {/* Ambient particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            animation: `float ${15 + Math.random() * 10}s ${Math.random() * 5}s ease-in-out infinite`
          }}
        >
          <Sparkles size={12} color="#60a5fa" />
        </div>
      ))}

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '0',
        right: '0',
        textAlign: 'center',
        zIndex: 20
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '900',
          background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
          letterSpacing: '-1px'
        }}>The Knowledge Iceberg</h2>
        <button
          onClick={() => setRevealed(!revealed)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s',
            color: 'white',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
          }}
        >
          {revealed ? 'Hide AI Power' : 'Reveal with AI'}
          <ChevronDown
            size={16}
            style={{
              transform: revealed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          />
        </button>
      </div>

      {/* Custom Iceberg SVG */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '300px',
        transform: 'translateX(-50%)',
        width: '420px',
        height: '500px',
        filter: revealed ? 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.6))' : 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'
      }}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="378" height="421"
          viewBox="0 0 378 421"
          style={{
            width: '100%',
            height: '100%'
          }}>
          <defs>
            <linearGradient id="iceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
              <stop offset="20%" stopColor="#bae6fd" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
            </linearGradient>
            <filter id="blur">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
          
          {/* Main iceberg path */}
          <path 
            d="M0 0 C5.49142443 0.70857089 7.40370942 3.40686825 10.875 7.5 C11.37128906 8.0671875 11.86757812 8.634375 12.37890625 9.21875 C13.47782778 10.47466031 14.57105913 11.73556072 15.66015625 13 C18.66730711 16.39431491 21.77205017 19.69337226 24.875 23 C29.01132958 27.41072454 33.10135411 31.83869417 37.046875 36.421875 C39.56568912 39.28514233 42.15816855 42.07787497 44.75 44.875 C48.35867975 48.76951577 51.9522411 52.67465853 55.5 56.625 C56.20898438 57.40746094 56.91796875 58.18992188 57.6484375 58.99609375 C59.29054247 60.84274162 60.8911491 62.70367637 62.4765625 64.59765625 C63.13857666 65.36988525 63.13857666 65.36988525 63.81396484 66.15771484 C65.05875029 67.61019634 66.28766321 69.07623662 67.515625 70.54296875 C69.6602464 72.78729372 69.6602464 72.78729372 72.16113281 72.30615234 C75.25351543 71.38756226 77.82339123 70.10305543 80.65625 68.55859375 C81.74550781 67.97529297 82.83476562 67.39199219 83.95703125 66.79101562 C86.23731601 65.55444978 88.51596347 64.31485994 90.79296875 63.07226562 C91.88222656 62.49025391 92.97148437 61.90824219 94.09375 61.30859375 C95.08310547 60.77032959 96.07246094 60.23206543 97.09179688 59.67749023 C99.98913598 58.45171247 101.77014971 58.11680434 104.875 58.5 C107.0859375 60.1875 107.0859375 60.1875 109.25 62.5 C110.03117187 63.32628906 110.81234375 64.15257812 111.6171875 65.00390625 C114.13048359 67.7824464 116.62831778 70.5686647 119.0703125 73.41015625 C122.60295226 77.50098367 126.25331725 81.48810228 129.875 85.5 C132.12296977 87.99687992 134.37008007 90.49453151 136.6171875 92.9921875 C138.14208244 94.68592894 139.66815402 96.37861169 141.1953125 98.0703125 C144.59372932 101.83737115 147.9831661 105.60915586 151.3125 109.4375 C154.96557956 113.63303221 158.72005549 117.73373553 162.46875 121.84375 C165.02525952 124.66587089 167.53043337 127.52765024 170.02734375 130.40234375 C172.30085479 132.98347574 174.6184325 135.52223978 176.9375 138.0625 C177.78183594 138.99707031 178.62617188 139.93164062 179.49609375 140.89453125 C180.9220936 142.45634061 182.36694155 144.00168297 183.84765625 145.51171875 C184.66556641 146.37216797 184.66556641 146.37216797 185.5 147.25 C185.96664063 147.71921875 186.43328125 148.1884375 186.9140625 148.671875 C188.58376484 151.8483819 188.36192336 153.95190406 187.875 157.5 C186.1624204 160.80844441 183.98190316 163.7124106 181.75 166.6875 C180.45529592 168.47234206 179.16103732 170.25750734 177.8671875 172.04296875 C177.20170898 172.94966309 176.53623047 173.85635742 175.85058594 174.79052734 C172.794253 178.98222073 169.83728864 183.24160494 166.875 187.5 C165.70627619 189.17095566 164.53700392 190.84152783 163.3671875 192.51171875 C162.78936523 193.33720215 162.21154297 194.16268555 161.61621094 195.01318359 C159.32033008 198.29218562 157.02340564 201.57045325 154.72460938 204.84741211 C153.57358174 206.49264513 152.42644866 208.14060961 151.28320312 209.79125977 C148.151793 214.30383916 144.95451173 218.74622376 141.6484375 223.1328125 C140.93671387 224.09985107 140.22499023 225.06688965 139.49169922 226.06323242 C138.14530894 227.89149687 136.77671343 229.70376647 135.37939453 231.4934082 C128.75887975 240.59851945 126.56158555 250.75185576 123.875 261.5 C123.53855727 262.82829048 123.20155428 264.15643913 122.86407471 265.48446655 C120.92237074 273.13075872 119.00218219 280.78235314 117.09570312 288.4375 C116.89833872 289.22995967 116.70097431 290.02241934 116.49762917 290.83889294 C115.48155611 294.92247973 114.46934495 299.0069856 113.4621582 303.09277344 C112.47220669 307.10685021 111.47207343 311.11827154 110.46527672 315.12815475 C110.08703704 316.64305246 109.71267025 318.15892279 109.34232521 319.67576981 C108.82873147 321.77807852 108.30226168 323.87676228 107.77270508 325.97509766 C107.47769608 327.16640289 107.18268707 328.35770813 106.8787384 329.58511353 C105.90062621 332.4255807 105.36350552 333.84394887 102.875 335.5 C99.1875 335.1875 99.1875 335.1875 95.875 334.5 C93.86424448 327.25403415 92.81020638 319.93715143 91.75 312.5 C91.56824219 311.24832031 91.38648438 309.99664062 91.19921875 308.70703125 C90.75416866 305.63852797 90.31286764 302.569535 89.875 299.5 C81.76044587 309.59483449 74.34297934 320.18416823 67.0625 330.8894043 C57.23836234 345.33438708 47.19472598 359.62930212 37.16870117 373.93457031 C33.37047983 379.35614253 29.58550147 384.78673477 25.81030273 390.22436523 C24.44837343 392.18309683 23.08335221 394.13968259 21.71508789 396.09399414 C18.56089687 400.60256621 15.4471655 405.12525161 12.44140625 409.734375 C11.9098291 410.53270752 11.37825195 411.33104004 10.83056641 412.15356445 C9.84830342 413.63138212 8.88432487 415.12158801 7.94287109 416.62573242 C5.55241176 420.17786492 4.65412807 421.32943181 0.32421875 422.27734375 C-4.15853434 421.26707437 -5.137605 419.86358649 -7.75 416.125 C-8.16403076 415.5477417 -8.57806152 414.9704834 -9.00463867 414.37573242 C-9.91189757 413.1070384 -10.80919021 411.83117358 -11.69775391 410.54931641 C-13.17163163 408.43304381 -14.67969842 406.34542916 -16.19921875 404.26171875 C-18.968292 400.46178259 -21.71550573 396.64671663 -24.45605469 392.82617188 C-39.30160115 371.85607776 -39.30160115 371.85607776 -54.80615234 351.38037109 C-56.125 349.5 -56.125 349.5 -56.125 347.5 C-56.785 347.5 -57.445 347.5 -58.125 347.5 C-58.28863037 348.02859619 -58.45226074 348.55719238 -58.62084961 349.10180664 C-60.58626953 355.24099098 -63.02231867 361.07236196 -65.6875 366.9375 C-66.08646484 367.83404297 -66.48542969 368.73058594 -66.89648438 369.65429688 C-67.28255859 370.50958984 -67.66863281 371.36488281 -68.06640625 372.24609375 C-68.41388916 373.01622803 -68.76137207 373.7863623 -69.11938477 374.57983398 C-70.125 376.5 -70.125 376.5 -72.125 378.5 C-75.0625 378.875 -75.0625 378.875 -78.125 378.5 C-80.40408883 375.97415538 -81.667176 373.50845869 -82.75634766 370.30957031 C-83.04223251 369.48201233 -83.32811737 368.65445435 -83.62266541 367.80181885 C-83.92507645 366.90299988 -84.22748749 366.00418091 -84.5390625 365.078125 C-84.86616714 364.12597107 -85.19327179 363.17381714 -85.5302887 362.19281006 C-86.23873831 360.12846264 -86.94396213 358.06300599 -87.64633179 355.99658203 C-89.52973445 350.45631081 -91.43664659 344.92412056 -93.33984375 339.390625 C-93.7321669 338.24775024 -94.12449005 337.10487549 -94.52870178 335.92736816 C-98.71136887 323.75701209 -103.004064 311.62629245 -107.3125 299.5 C-108.35116924 296.57447158 -109.38977637 293.64892144 -110.42791748 290.72320557 C-111.07979312 288.88902418 -111.73343441 287.0554692 -112.38897705 285.22259521 C-113.87865308 281.05179111 -115.34230225 276.87684701 -116.73291016 272.671875 C-119.32734883 264.89047991 -122.0430634 258.03818344 -127.125 251.5 C-128.10767063 250.11967532 -129.08680016 248.73682334 -130.0625 247.3515625 C-131.08138987 245.94130217 -132.10229579 244.53249667 -133.125 243.125 C-133.681875 242.35607422 -134.23875 241.58714844 -134.8125 240.79492188 C-139.47058404 234.37446005 -144.17740462 227.990321 -148.89038086 221.61010742 C-154.48400027 214.03078025 -159.99976852 206.39660505 -165.50292969 198.75146484 C-167.71565628 195.6801577 -169.93402211 192.61294757 -172.15332031 189.54638672 C-173.24879445 188.03019635 -174.34194278 186.5123225 -175.43261719 184.99267578 C-177.96777976 181.46227904 -180.52477237 177.95733571 -183.1640625 174.50390625 C-183.63368408 173.87838867 -184.10330566 173.25287109 -184.5871582 172.60839844 C-185.4549841 171.45422608 -186.33542172 170.30937195 -187.23120117 169.17675781 C-190.17590363 165.21917659 -190.80449375 162.36970524 -190.125 157.5 C-188.76171875 155.33984375 -188.76171875 155.33984375 -186.8125 153.4375 C-183.22837378 149.72109495 -180.01487238 145.89979132 -176.875 141.8125 C-173.08691189 136.92227845 -169.18166701 132.16962493 -165.125 127.5 C-161.15666258 122.930032 -157.3312428 118.28500512 -153.625 113.5 C-149.44432828 108.10247571 -145.08109601 102.9044499 -140.60546875 97.75 C-137.15557653 93.75632632 -133.85640754 89.67188748 -130.625 85.5 C-126.37861937 80.01851825 -121.95080513 74.72967294 -117.41210938 69.48852539 C-109.95008657 60.93035033 -109.95008657 60.93035033 -103.34375 51.72265625 C-101.125 49.5 -101.125 49.5 -97.91674805 49.14672852 C-93.69963351 49.53963076 -90.81649066 50.82975183 -87.23828125 52.9296875 C-86.61398727 53.28008087 -85.9896933 53.63047424 -85.34648132 53.9914856 C-83.36862461 55.10553608 -81.40314692 56.23957169 -79.4375 57.375 C-78.10690641 58.13029372 -76.77553205 58.8842137 -75.44335938 59.63671875 C-73.00058171 61.01730347 -70.56353017 62.4071735 -68.13012695 63.80419922 C-65.81917582 65.10827482 -63.5137229 66.34788284 -61.125 67.5 C-54.97079474 60.90867362 -49.02828481 54.24347506 -43.37109375 47.21484375 C-41.0366941 44.39326505 -38.60509402 41.69409288 -36.125 39 C-32.01121091 34.5301488 -28.15412703 29.90955107 -24.33984375 25.18359375 C-21.47133362 21.70799153 -18.44175957 18.39584721 -15.40625 15.06640625 C-12.10974735 11.35784077 -8.99264531 7.51151234 -5.875 3.65234375 C-3.33988776 0.53438204 -3.33988776 0.53438204 0 0 Z" 
            fill="url(#iceGradient)"
            fillOpacity="0.8"
            stroke="white"
            strokeOpacity="0.15"
            strokeWidth="1.2"
            style={{ mixBlendMode: "screen", opacity: 0.9 }}
            transform="translate(190.125,-0.5)"
          />
          
          {/* Small star/detail */}
          <path 
            d="M0 0 C2.1385485 2.1385485 2.42655063 3.13275314 3 6 C5.31 6.66 7.62 7.32 10 8 C10 8.66 10 9.32 10 10 C8.576875 10.2784375 8.576875 10.2784375 7.125 10.5625 C3.61628301 11.73400805 3.61628301 11.73400805 2.625 15.625 C2.41875 16.73875 2.2125 17.8525 2 19 C1.34 19 0.68 19 0 19 C-0.33 16.69 -0.66 14.38 -1 12 C-2.134375 11.87625 -3.26875 11.7525 -4.4375 11.625 C-6.2009375 11.315625 -6.2009375 11.315625 -8 11 C-8.33 10.34 -8.66 9.68 -9 9 C-7.88625 8.62875 -6.7725 8.2575 -5.625 7.875 C-2.38621238 6.5205979 -2.10727559 6.23787197 -0.5625 2.8125 C-0.376875 1.884375 -0.19125 0.95625 0 0 Z" 
            fill="url(#iceGradient)" 
            transform="translate(124,27)"
          />
        </svg>
      </div>

      {/* Knowledge Sections */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '380px',
        top: '360px'
      }}>
        {/* Surface Knowledge */}
        <div
          style={{
            background: hoveredSection === 'surface'
              ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '-80px',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredSection === 'surface' ? 'scale(1.02)' : 'scale(1)'
          }}
          onMouseEnter={() => setHoveredSection('surface')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <h3 style={{
            fontWeight: '700',
            marginBottom: '12px',
            color: '#e0f2fe',
            fontSize: '18px'
          }}>What You Know</h3>
          <div style={{
            fontSize: '28px',
            fontWeight: '900',
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>15%</div>
          <ul style={{
            fontSize: '14px',
            color: '#cbd5e1',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '6px' }}>• Basic material properties</li>
            <li style={{ marginBottom: '6px' }}>• Published research papers</li>
            <li>• Industry standard practices</li>
          </ul>
        </div>
        {/* Expert Knowledge */}
        <motion.div
          style={{
            background: hoveredSection === 'expert'
              ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredSection === 'expert' ? 'scale(1.02)' : 'scale(1)',
          }}
          onMouseEnter={() => setHoveredSection('expert')}
          onMouseLeave={() => setHoveredSection(null)}
          key={`expert-${revealed}`}
          variants={{
            hidden: { filter: "blur(8px)", opacity: 0.8 },
            revealed: { filter: "blur(0px)", opacity: 1 }
          }}
          initial={revealExpert ? "revealed" : "hidden"}
          animate={revealExpert ? "revealed" : "hidden"}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 style={{
            fontWeight: '700',
            marginBottom: '12px',
            color: '#bae6fd',
            fontSize: '18px'
          }}>What Experts Know After 10 Years</h3>
          <div style={{
            fontSize: '28px',
            fontWeight: '900',
            background: 'linear-gradient(to right, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>25%</div>
          <ul style={{
            fontSize: '14px',
            color: '#94a3b8',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '6px' }}>• Deep pattern recognition</li>
            <li style={{ marginBottom: '6px' }}>• Failure mode intuition</li>
            <li>• Proprietary optimization techniques</li>
          </ul>
        </motion.div>
        {/* Hidden Knowledge */}
        <motion.div
          style={{
            background: hoveredSection === 'hidden'
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredSection === 'hidden' ? 'scale(1.02)' : 'scale(1)',
          }}
          onMouseEnter={() => setHoveredSection('hidden')}
          onMouseLeave={() => setHoveredSection(null)}
          key={`hidden-${revealed}`}
          variants={{
            hidden: { filter: "blur(12px)", opacity: 0.7 },
            revealed: { filter: "blur(0px)", opacity: 1 }
          }}
          initial={revealHidden ? "revealed" : "hidden"}
          animate={revealHidden ? "revealed" : "hidden"}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 style={{
            fontWeight: '700',
            marginBottom: '12px',
            color: '#e0e7ff',
            fontSize: '20px'
          }}>What You Should Really Know</h3>
          <div style={{
            fontSize: '36px',
            fontWeight: '900',
            background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>60%</div>
          <ul style={{
            fontSize: '15px',
            color: '#c7d2fe',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '8px' }}>• Cross-domain material synergies</li>
            <li style={{ marginBottom: '8px' }}>• Unexplored chemical spaces</li>
            <li style={{ marginBottom: '8px' }}>• Quantum-level interactions</li>
            <li style={{ marginBottom: '8px' }}>• Manufacturing scalability secrets</li>
            <li>• Cost optimization pathways</li>
          </ul>
        </motion.div>
      </div>

      {/* Scanner Line Effect - only visible while animating */}
      {revealed && scannerPosition > 0 && scannerPosition < 1000 && (
        <div style={{
          position: 'absolute',
          left: '0',
          right: '0',
          top: `${scannerPosition}px`,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 20%, #60a5fa 50%, #8b5cf6 80%, transparent 100%)',
          boxShadow: '0 0 20px #8b5cf6, 0 0 40px #60a5fa',
          zIndex: 25,
          opacity: 0.8
        }} />
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default IcebergVisualization;