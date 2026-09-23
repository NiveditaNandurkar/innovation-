import type { EventData } from '../types';
import { Modal, Drawer } from './Modal';
import { EventDetailsBody } from './EventDetailsBody';

export function EventDetailModal({
  event,
  onClose,
  onRegister,
}: {
  event: EventData | null;
  onClose: () => void;
  onRegister: (event: EventData) => void;
}) {
  if (!event) return null;
  const body = (
    <EventDetailsBody event={event} onClose={onClose} onRegister={onRegister} />
  );

  return (
    <>
      <div className="modal-details center-panel">
        <Modal open={true} onClose={onClose} label={`${event.name} — event details`}>
          <div style={{ padding: 'clamp(20px, 3.5vw, 34px)' }}>{body}</div>
        </Modal>
      </div>
      <div className="modal-details drawer">
        <Drawer open={true} onClose={onClose} label={`${event.name} — event details`}>
          <div style={{ padding: 'clamp(20px, 3.5vw, 30px)' }}>{body}</div>
        </Drawer>
      </div>
    </>
  );
}