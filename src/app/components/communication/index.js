'use client';
import Image from 'next/image';
import { playSound } from '@/audio/soundManager';

import styles from './styles.module.scss';

const ContactPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.label}>COMMUNICATIONS</div>
      <div className={styles.contactRow}>
        <Image
          src="/envelope.svg"
          alt="Mail icon"
          className={styles.img}
          width="25"
          height="25"
        />
        <button
          className={styles.contactButton}
          aria-label="Send mission report via email"
          onClick={() => {
            playSound('delayButton-0');
            try {
              window.location.href =
                'mailto:wlad25888@gmail.com?subject=BattleshipMission%20Report&body=Status%20update%20required';
            } catch (e) {
              alert(
                'Mail client not found. Please send your message manually to wlad25888@gmail.com.',
              );
            }
          }}
        >
          SEND REPORT
        </button>
      </div>

      <div className={styles.contactRow}>
        <Image
          src="/chat.svg"
          alt="Chat icon"
          className={styles.img}
          width="25"
          height="25"
        />
        <button
          className={styles.contactButton}
          aria-label="Open Telegram channel"
          onClick={() => {
            playSound('delayButton-0');
            window.open(
              'https://t.me/Wlad9999',
              '_blank',
              'noopener,noreferrer',
            );
          }}
        >
          ACCESS COMMAND CHANNEL
        </button>
      </div>
    </div>
  );
};

export default ContactPanel;
