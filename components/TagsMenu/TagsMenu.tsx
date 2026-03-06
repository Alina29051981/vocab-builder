'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NOTE_TAGS } from '../../types/note';
import css from './TagsMenu.module.css';

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const currentTag = pathname?.split('/').pop() || 'All';

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <div className={css.menuContainer}>
      <button
        className={css.menuButton}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        Notes ▾
      </button>

      {isOpen && (
        <ul className={css.menuList} role="menu">
          <li key="All" className={css.menuItem} role="none">
            <Link
              href="/notes/filter/All"
              className={`${css.menuLink} ${currentTag === 'All' ? css.active : ''}`}
              role="menuitem"
              onClick={() => setIsOpen(false)} 
            >
              All
            </Link>
          </li>

          {NOTE_TAGS.map(tag => (
            <li key={tag} className={css.menuItem} role="none">
              <Link
                href={`/notes/filter/${tag}`}
                className={`${css.menuLink} ${currentTag === tag ? css.active : ''}`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
