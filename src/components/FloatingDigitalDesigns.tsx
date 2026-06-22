'use client';

import { useEffect, useState } from 'react';
import styles from './FloatingDigitalDesigns.module.css';
import { cn } from '@/lib/utils';

export default function FloatingDigitalDesigns() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container} style={{ pointerEvents: 'none' }}>
      
      {/* Complex Neural / Server Node Network */}
      <div className={cn(styles.shape, styles.network)}>
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="100" cy="50" r="4" fill="currentColor" />
          <circle cx="150" cy="100" r="4" fill="currentColor" />
          <circle cx="50" cy="100" r="4" fill="currentColor" />
          <circle cx="100" cy="150" r="4" fill="currentColor" />
          <circle cx="30" cy="50" r="3" fill="currentColor" />
          <circle cx="170" cy="150" r="3" fill="currentColor" />
          
          <path d="M100 50 L150 100 L100 150 L50 100 Z" strokeDasharray="3 3" />
          <path d="M100 50 L50 100" />
          <path d="M150 100 L100 150" />
          <line x1="100" y1="50" x2="30" y2="50" strokeDasharray="2 4" />
          <line x1="150" y1="100" x2="170" y2="150" strokeDasharray="2 4" />
          
          <circle cx="100" cy="100" r="30" stroke="currentColor" strokeDasharray="5 5" />
          <circle cx="100" cy="100" r="2" fill="currentColor" />
          <line x1="100" y1="70" x2="100" y2="130" opacity="0.5" />
          <line x1="70" y1="100" x2="130" y2="100" opacity="0.5" />
        </svg>
      </div>

      {/* Floating Code Snippet */}
      <div className={cn(styles.shape, styles.codeBlock)}>
        <div className={styles.codeContent}>
          <span className={styles.keyword}>async</span> <span className={styles.function}>function</span> <span className={styles.method}>initializeSystem</span>() {'{'}
          <br/>&nbsp;&nbsp;<span className={styles.keyword}>await</span> server.<span className={styles.method}>connect</span>();
          <br/>&nbsp;&nbsp;<span className={styles.keyword}>const</span> nodes = <span className={styles.keyword}>await</span> api.<span className={styles.method}>fetchTopology</span>();
          <br/>&nbsp;&nbsp;<span className={styles.keyword}>if</span> (nodes.<span className={styles.property}>length</span> &gt; <span className={styles.number}>0</span>) {'{'}
          <br/>&nbsp;&nbsp;&nbsp;&nbsp;network.<span className={styles.method}>deploy</span>(nodes);
          <br/>&nbsp;&nbsp;{'}'}
          <br/>{'}'}
        </div>
      </div>

      {/* Detailed Wireframe Database Cylinder */}
      <div className={cn(styles.shape, styles.database)}>
        <svg viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Top Disk */}
          <ellipse cx="50" cy="30" rx="40" ry="15" />
          {/* Middle Disks */}
          <ellipse cx="50" cy="60" rx="40" ry="15" strokeDasharray="2 2" opacity="0.6"/>
          <ellipse cx="50" cy="90" rx="40" ry="15" strokeDasharray="2 2" opacity="0.6"/>
          {/* Bottom Disk */}
          <ellipse cx="50" cy="120" rx="40" ry="15" />
          
          {/* Vertical bounds */}
          <line x1="10" y1="30" x2="10" y2="120" />
          <line x1="90" y1="30" x2="90" y2="120" />
          
          {/* Data processing indicators */}
          <rect x="35" y="55" width="30" height="10" rx="2" fill="currentColor" opacity="0.3" />
          <circle cx="25" cy="60" r="2" fill="currentColor" className={styles.blinkFast} />
          <circle cx="25" cy="90" r="2" fill="currentColor" className={styles.blinkSlow} />
        </svg>
      </div>

      {/* Advanced Cybernetic Circuit Board Segment */}
      <div className={cn(styles.shape, styles.circuit)}>
        <svg viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M10 10 L40 10 L60 30 L60 70 L90 70 L110 50 L140 50" />
          <path d="M10 30 L30 30 L50 50 L50 90 L80 120 L140 120" />
          <path d="M10 50 L20 50 L40 70 L40 110 L60 130 L100 130 L110 140 L140 140" strokeDasharray="4 2" opacity="0.7"/>
          
          <rect x="85" y="65" width="10" height="10" fill="currentColor" />
          <rect x="105" y="45" width="10" height="10" strokeWidth="2" />
          <circle cx="40" cy="10" r="3" fill="currentColor" />
          <circle cx="140" cy="50" r="3" fill="currentColor" />
          <circle cx="140" cy="120" r="3" fill="currentColor" />
          <circle cx="100" cy="130" r="3" fill="currentColor" />
          
          {/* CPU / Microchip Block */}
          <rect x="65" y="85" width="30" height="30" strokeWidth="1.5" />
          <rect x="70" y="90" width="20" height="20" fill="currentColor" opacity="0.2"/>
          <line x1="70" y1="80" x2="70" y2="85" />
          <line x1="80" y1="80" x2="80" y2="85" />
          <line x1="90" y1="80" x2="90" y2="85" />
          <line x1="70" y1="115" x2="70" y2="120" />
          <line x1="80" y1="115" x2="80" y2="120" />
          <line x1="90" y1="115" x2="90" y2="120" />
          <line x1="60" y1="95" x2="65" y2="95" />
          <line x1="60" y1="105" x2="65" y2="105" />
          <line x1="95" y1="95" x2="100" y2="95" />
          <line x1="95" y1="105" x2="100" y2="105" />
        </svg>
      </div>
      
      {/* Terminal CLI Prompt */}
      <div className={cn(styles.shape, styles.terminal)}>
        <div className={styles.terminalHeader}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        <div className={styles.terminalBody}>
          <span>root@n3xus-core:~#</span> ./deploy_api.sh
          <br/><span className={styles.terminalOutput}>[OK] Establishing secure handshake...</span>
          <br/><span className={styles.terminalOutput}>[OK] Mounting volume...</span>
          <br/>root@n3xus-core:~# <span className={styles.blinkFast}>_</span>
        </div>
      </div>
    </div>
  );
}
