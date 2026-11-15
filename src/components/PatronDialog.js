import React, { useId } from 'react';
import { Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconEye, IconX } from '@tabler/icons-react';
import { PatronEmblem, PatronsRule } from './PatronCard';
import { seasonTint, tagLabel } from '../utils/patrons';

const FORMAT_CHANGING = 'Format-changing';

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
 * One ability: its key and name, then who sees it and any flags, then the rules text.
 * Visibility comes first because it changes how the rest reads.
 */
function Ability({ ability }) {
  const headingId = useId();
  const visibility = ability.tags.find((tag) => tag.kind === 'visibility');
  const flags = ability.tags.filter((tag) => tag.kind !== 'visibility');

  return (
    <section className="patron-ability" aria-labelledby={headingId}>
      <div className="patron-ability__head">
        <span className="patron-ability__key" aria-hidden="true">{ability.key}</span>
        <h3 id={headingId} className="patron-ability__name">
          <span className="visually-hidden">{ability.key}: </span>
          {ability.name}
        </h3>
      </div>

      {(visibility || flags.length > 0) && (
        <ul className="patron-ability__tags">
          {visibility && (
            <li className="patron-tag patron-tag--visibility">
              <IconEye size={13} stroke={2} aria-hidden="true" />
              <span className="visually-hidden">Visibility: </span>
              {visibility.value}
            </li>
          )}
          {flags.map((tag, index) => <li key={index} className="patron-tag">{tagLabel(tag)}</li>)}
        </ul>
      )}
      {visibility?.note && <p className="patron-ability__note">{visibility.note}</p>}

      <div className="patron-ability__body">
        {ability.blocks.map((block, index) => <AbilityBlock key={index} block={block} />)}
      </div>
    </section>
  );
}

/**
 * A patron and their two abilities, over the grid. Mantine supplies the behaviour (focus trap, Esc,
 * scroll lock, focus back to the card); patrons.css supplies the look. The dialog is open while
 * `opened` is true; `patron` stays set while it fades out so the content doesn't vanish first.
 */
function PatronDialog({ patron, season, opened, onClose }) {
  const phone = useMediaQuery('(max-width: 48em)', false, { getInitialValueInEffect: false });
  const formatChanging = patron?.abilities.some((ability) => ability.tags.some((tag) => tag.value === FORMAT_CHANGING));
  const rules = formatChanging ? season?.rules || [] : [];

  return (
    <Modal.Root
      opened={opened && Boolean(patron)}
      onClose={onClose}
      size={960}
      centered
      fullScreen={phone}
      radius={0}
      shadow="none"
      transitionProps={{ transition: 'fade', duration: 160 }}
      className="patron-dialog"
      // Through classNames, not Modal.Content's className: that one also lands on Mantine's fixed wrapper.
      classNames={{ content: 'patron-dialog__content' }}
      style={patron ? { '--tint': seasonTint(patron.season) } : undefined}
    >
      <Modal.Overlay color="#04070c" backgroundOpacity={0.85} blur={0} />
      <Modal.Content>
        {/* First in the dialog, so it takes the focus when the dialog opens. */}
        <button type="button" className="patron-dialog__close" onClick={onClose} aria-label="Close">
          <IconX size={18} stroke={2} aria-hidden="true" />
        </button>

        {patron && season && (
          <div className="patron-dialog__layout">
            <div className="patron-dialog__portrait" aria-hidden="true">
              <PatronEmblem name={patron.name} image={patron.image} sizes={phone ? '120px' : '300px'} eager />
            </div>

            {/* The part that scrolls; focusable so the keyboard can scroll it too. */}
            <div className="patron-dialog__main" tabIndex={0} role="group" aria-label={`${patron.name}'s abilities`}>
              <header className="patron-dialog__head">
                <p className="patron-dialog__eyebrow">
                  <i aria-hidden="true" />
                  {season.label} · {season.name}
                </p>
                <Modal.Title className="patron-dialog__title">{patron.name}</Modal.Title>
                {patron.origin && (
                  <p className="patron-dialog__origin">{season.originLabel}: {patron.origin}</p>
                )}
                <PatronsRule />
              </header>

              {patron.abilities.map((ability) => <Ability key={ability.key} ability={ability} />)}

              {rules.length > 0 && (
                <aside className="patron-dialog__rules" aria-label={`${season.label} rule`}>
                  <h4 className="patron-ability__subhead">{season.label} rule</h4>
                  {rules.map((rule, index) => <p key={index}>{rule}</p>)}
                </aside>
              )}
            </div>
          </div>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}

export default PatronDialog;
