"use client";

import Modal from "./modals/Modal";

type GiveUpModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

export default function GiveUpModal({ onConfirm, onClose }: GiveUpModalProps) {
  return (
    <Modal onClose={onClose} title="Ўпэўнены?">
      <p className="text-sm text-[var(--text-muted)] mb-5">
        Вы сапраўды хочаце здацца? Гэта скіне вашу бягучую серыю перамог.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button onClick={onConfirm} type="button" className="btn-primary">
          Здацца
        </button>
        <button onClick={onClose} type="button" className="btn-ghost">
          Не
        </button>
      </div>
    </Modal>
  );
}
