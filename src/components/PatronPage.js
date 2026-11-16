import React, { useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';
import { IconArrowLeft, IconBan, IconEye, IconHeart, IconShield, IconSword } from '@tabler/icons-react';
import Masthead from './Masthead';
import { PatronEmblem, PatronsRule } from './PatronCard';
import { openSearch } from './SearchPalette';
import { publicUrl } from '../utils/chats';
import { STAT_KEYS, STAT_MAX, nameTier, seasonTint, tagLabel } from '../utils/patrons';

const FORMAT_CHANGING = 'Format-changing';
const LORE_SOON = 'Lore coming soon, stay tuned.';

const CLASSES = {
  offence: { label: 'Offence', Icon: IconSword },
  defence: { label: 'Defence', Icon: IconShield },
  support: { label: 'Support', Icon: IconHeart },
};

const STAT_LABELS = {
  offence: 'Offence',
  defence: 'Defence',
  difficulty: 'Difficulty',
  survivability: 'Survivability',
  utility: 'Utility',
  support: 'Support',
};

const SEGMENTS = Array.from({ length: STAT_MAX }, (_, index) => index);

/** A plain left click, which the page handles itself. Any other click (a new tab, say) follows the link. */
const isPlainClick = (event) => event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;

/** One paragraph, subheading or list from the Patron sheet, exactly as the sheet wrote it. */
function AbilityBlock({ block }) {
  if (block.h) return <h4 className="patron-ability__subhead">{block.h}</h4>;
  if (block.ul) {
    return (
      <ul className="patron-ability__list">
        {block.ul.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    );
  }
  return <p>{block.p}</p>;
}

/**
 * One ability: its badge and name, then who sees it and any flags, then the rules text. Visibility comes first
 * because it changes how the rest reads. A patron played as two (Izanagi & Izanami) has a visibility for each.
 */
function AbilityCard({ ability }) {
  const headingId = useId();
  const visibility = ability.tags.filter((tag) => tag.kind === 'visibility');
  const flags = ability.tags.filter((tag) => tag.kind !== 'visibility');

  return (
    <article className="patron-ability" aria-labelledby={headingId}>
      <div className="patron-ability__head">
        <span className="patron-ability__badge" aria-hidden="true">
          <span>{ability.key}</span>
        </span>
        <div className="patron-ability__heading">
          <p className="patron-ability__kicker">Ability {ability.key.replace(/\D/g, '')}</p>
          <h3 id={headingId} className="patron-ability__name">
            <span className="visually-hidden">{ability.key}: </span>
            {ability.name}
          </h3>
        </div>
      </div>

      {ability.tags.length > 0 && (
        <ul className="patron-ability__tags">
          {visibility.map((tag, index) => (
            <li key={`visibility-${index}`} className="patron-tag patron-tag--visibility">
              <IconEye size={13} stroke={2} aria-hidden="true" />
              <span className="visually-hidden">Visibility: </span>
              {tagLabel(tag, { withNote: false })}
            </li>
          ))}
          {flags.map((tag, index) => <li key={`flag-${index}`} className="patron-tag">{tagLabel(tag)}</li>)}
        </ul>
      )}
      {visibility.filter((tag) => tag.note).map((tag, index) => (
        <p key={index} className="patron-ability__note">{tag.note}</p>
      ))}

      <div className="patron-ability__body">
        {ability.blocks.map((block, index) => <AbilityBlock key={index} block={block} />)}
      </div>
    </article>
  );
}

/**
 * The patron's class and their six stats, each out of 5. The number is always said in words ("4 out of 5"),
 * so the bars are only a picture of it. Drawn only when the patron has a class and every stat.
 */
function PatronStats({ patron }) {
  const role = CLASSES[patron.class];
  const { stats } = patron;
  if (!role || !stats || !STAT_KEYS.every((key) => Number.isFinite(stats[key]))) return null;
  const { Icon } = role;

  return (
    <section className="patron-stats" aria-label="Class and patron stats">
      <div className="patron-stats__class">
        <span className="patron-stats__emblem" aria-hidden="true">
          <Icon size={28} stroke={2} />
        </span>
        <div>
          <p className="patron-stats__label">Class</p>
          <p className="patron-stats__class-name">{role.label}</p>
        </div>
      </div>

      <div className="patron-stats__body">
        <p className="patron-stats__heading">Patron stats</p>
        <dl className="patron-stats__list">
          {STAT_KEYS.map((key) => {
            const value = Math.min(STAT_MAX, Math.max(0, Math.round(stats[key])));
            return (
              <div key={key} className="patron-stats__row">
                <dt>{STAT_LABELS[key]}</dt>
                <dd className="patron-stats__bar" aria-hidden="true">
                  {SEGMENTS.map((index) => (
                    <span key={index} className={index < value ? 'patron-stats__seg patron-stats__seg--on' : 'patron-stats__seg'} />
                  ))}
                </dd>
                <dd className="patron-stats__value">
                  {value}
                  <span className="visually-hidden"> out of {STAT_MAX}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/**
 * The top half, on the patron's portrait: the way back, then the season, the name, the region or franchise,
 * a Banned tag for a banned patron, the lore and the class and stats. The sharp portrait sits on the right and a dimmed, blurred copy of it fills
 * the rest. A patron without a portrait gets the card's emblem in its place.
 */
function PatronHero({ patron, season, titleId, closeTo, onClose }) {
  const image = patron.image ? publicUrl(patron.image) : null;
  const lore = typeof patron.lore === 'string' ? patron.lore.trim() : '';

  return (
    <section className="patron-hero" aria-labelledby={titleId}>
      {image ? (
        <>
          <img className="patron-hero__backdrop" src={image} alt="" aria-hidden="true" decoding="async" />
          <div className="patron-hero__scrim" aria-hidden="true" />
          <img
            className="patron-hero__portrait"
            src={image}
            alt={`Portrait of ${patron.name}`}
            width="720"
            height="900"
            decoding="async"
          />
        </>
      ) : (
        <div className="patron-hero__portrait patron-hero__portrait--emblem" aria-hidden="true">
          <PatronEmblem name={patron.name} tint={seasonTint(patron.season)} />
        </div>
      )}
      <div className="patron-hero__fade" aria-hidden="true" />

      {/* Takes the focus when the page opens. It links to the grid, but a plain click steps back to it, like Esc. */}
      <Link
        to={closeTo}
        className="patron-hero__back"
        data-autofocus
        onClick={(event) => {
          if (!isPlainClick(event)) return;
          event.preventDefault();
          onClose();
        }}
      >
        <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
        All patrons
      </Link>

      <div className="patron-hero__content">
        <div className="patron-hero__column">
          <div className="patron-hero__id">
            <p className="patron-hero__season">
              <i aria-hidden="true" />
              <span>{season.label} · {season.name}</span>
            </p>
            {/* Mantine's title, made an h1: it names the dialog as well as the page. */}
            <Modal.Title component="h1" className={`patron-hero__name patron-hero__name--t${nameTier(patron.name)}`}>
              {patron.name}
            </Modal.Title>
            {patron.origin && <p className="patron-hero__origin">{season.originLabel}: {patron.origin}</p>}
            {patron.banned && (
              <p className="patron-hero__banned">
                <IconBan size={14} stroke={2} aria-hidden="true" />
                Banned
              </p>
            )}
          </div>
          <PatronsRule className="patrons-rule--season" />
          <p className={lore ? 'patron-hero__lore' : 'patron-hero__lore patron-hero__lore--soon'}>{lore || LORE_SOON}</p>
          <PatronStats patron={patron} />
        </div>
      </div>
    </section>
  );
}

/** The bottom half, on the season's colours: both abilities side by side, then the season's rule if either changes the format. */
function PatronAbilities({ patron, season }) {
  const headingId = useId();
  const formatChanging = patron.abilities.some((ability) => ability.tags.some((tag) => tag.value === FORMAT_CHANGING));
  const rules = formatChanging ? season.rules || [] : [];

  return (
    <section className="patron-abilities" aria-labelledby={headingId}>
      <div className="patron-abilities__inner">
        <header className="patron-abilities__head">
          <h2 id={headingId} className="patron-abilities__title">Abilities</h2>
          <PatronsRule className="patrons-rule--season" />
        </header>

        <div className="patron-abilities__grid">
          {patron.abilities.map((ability) => <AbilityCard key={ability.key} ability={ability} />)}
        </div>

        {rules.length > 0 && (
          <aside className="patron-rules" aria-label={`${season.label} rule`}>
            <h4 className="patron-ability__subhead">{season.label} rule</h4>
            {rules.map((rule, index) => <p key={index}>{rule}</p>)}
          </aside>
        )}
      </div>
    </section>
  );
}

/**
 * A patron's page, full screen over the grid: the hero on their portrait, then their abilities on the season's
 * colours. Mantine supplies the behaviour (focus trap, scroll lock, focus back to the card); patrons.css supplies
 * the look. The site's top bar is drawn again inside, since the grid's own is out of reach while this is open.
 * It opens and closes at once, like a page. `closeTo` is the grid's address, for the back link.
 */
function PatronPage({ patron, season, closeTo, onClose }) {
  const id = useId();
  const contentRef = useRef(null);
  const opened = Boolean(patron && season);

  // Esc closes the page, but not while the top bar's search is open over it: the search has the focus then,
  // and Esc is its to close. (Mantine's own Esc would close both at once.)
  useWindowEvent('keydown', (event) => {
    if (event.key !== 'Escape' || event.isComposing || !opened) return;
    const dialog = event.target instanceof Element ? event.target.closest('[role="dialog"]') : null;
    if (dialog && dialog !== contentRef.current) return;
    onClose();
  });

  return (
    <Modal.Root
      id={id}
      opened={opened}
      onClose={onClose}
      closeOnEscape={false}
      fullScreen
      transitionProps={{ duration: 0 }}
      className="patron-overlay"
      // Through classNames, not Modal.Content's className: that one also lands on Mantine's fixed wrapper.
      classNames={{ content: 'patron-overlay__content' }}
    >
      <Modal.Content ref={contentRef}>
        {opened && (
          <div className="patron-page" data-season={patron.season}>
            <Masthead current="patrons" onSearch={openSearch} searchLabel="Search every season" />
            {/* Mantine names the title `${id}-title`, so the hero can point at it too. */}
            <PatronHero patron={patron} season={season} titleId={`${id}-title`} closeTo={closeTo} onClose={onClose} />
            <PatronAbilities patron={patron} season={season} />
          </div>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}

export default PatronPage;
