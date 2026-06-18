'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // You can replace these links with your actual Discord/Telegram profile or invite links
  const discordLink = "https://discord.gg/your-invite-code";
  const telegramLink = "https://t.me/your_telegram_username";

  return (
    <>
      <style>{`
        .chat-widget-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }
        .chat-menu {
          background-color: #141432;
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
          margin-bottom: 16px;
          width: 280px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: bottom right;
        }
        .chat-menu.closed {
          transform: scale(0) translateY(32px);
          opacity: 0;
          pointer-events: none;
        }
        .chat-menu.open {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        .chat-menu h4 {
          color: #00f0ff;
          font-weight: bold;
          margin-top: 0;
          margin-bottom: 8px;
        }
        .chat-menu p {
          color: #e8e8f0;
          font-size: 14px;
          margin-bottom: 16px;
          opacity: 0.8;
        }
        .chat-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .chat-btn.discord {
          background-color: rgba(88, 101, 242, 0.1);
          border: 1px solid rgba(88, 101, 242, 0.3);
        }
        .chat-btn.discord:hover {
          background-color: rgba(88, 101, 242, 0.2);
        }
        .chat-btn.telegram {
          background-color: rgba(0, 136, 204, 0.1);
          border: 1px solid rgba(0, 136, 204, 0.3);
        }
        .chat-btn.telegram:hover {
          background-color: rgba(0, 136, 204, 0.2);
        }
        .chat-btn span {
          font-weight: 600;
          font-size: 14px;
        }
        .chat-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #00f0ff;
          color: #0a0a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }
        .chat-fab:hover {
          transform: scale(1.05);
          background-color: #00d0e0;
        }
        .chat-fab:active {
          transform: scale(0.95);
        }
      `}</style>
      <div className="chat-widget-container">
        {/* Expanded Menu */}
        <div className={`chat-menu ${isOpen ? 'open' : 'closed'}`}>
          <h4>Chat with Us 🚀</h4>
          <p>We're online! Choose your preferred platform to start a live chat.</p>
          
          <div className="chat-options">
            <Link href={discordLink} target="_blank" rel="noopener noreferrer" className="chat-btn discord">
              <svg width="24" height="24" viewBox="0 0 127.14 96.36" fill="#5865F2">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.68,65.33C38.08,65.33,34.2,61,34.2,55.77s3.79-9.56,8.48-9.56c4.71,0,8.54,4.36,8.48,9.56C51.16,61,47.39,65.33,42.68,65.33Zm41.83,0c-4.6,0-8.48-4.36-8.48-9.56s3.79-9.56,8.48-9.56c4.71,0,8.54,4.36,8.48,9.56C84.51,61,80.74,65.33,84.51,65.33Z"/>
              </svg>
              <span style={{ color: '#5865F2' }}>Discord</span>
            </Link>

            <Link href={telegramLink} target="_blank" rel="noopener noreferrer" className="chat-btn telegram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0088cc">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.46.93-4.12 2.73-.39.27-.74.41-1.05.4-.34-.01-1-.19-1.49-.35-.6-.2-1.08-.31-1.04-.66.02-.18.27-.36.75-.55 2.94-1.28 4.9-2.12 5.88-2.53 2.79-1.16 3.37-1.36 3.75-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
              </svg>
              <span style={{ color: '#0088cc' }}>Telegram</span>
            </Link>
          </div>
        </div>

        {/* Floating Action Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="chat-fab" aria-label="Toggle Live Chat">
          {isOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
