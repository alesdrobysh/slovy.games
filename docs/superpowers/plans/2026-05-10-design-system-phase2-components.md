# Design System — Phase 2: Shared UI Components & Hooks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract 7 reusable UI components and 4 hooks from duplicated game code into `src/shared/components/ui/` and `src/shared/hooks/`.

**Architecture:** Each component is extracted from the best existing implementation, generalized for both games, styled with Tailwind + `--sly-*` tokens. Hooks extract duplicated behavior (modal logic, share, countdown, animation). Components use `isOpen`/`onClose` controlled pattern. No visual changes to existing game pages during extraction — we create new shared components alongside existing ones first, then swap in Phase 3.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS v4, TypeScript, Jest + Testing Library

---

## File Structure

```
src/shared/
  components/
    ui/
      Modal.tsx            ← NEW: from pobach/Modal.tsx, generalized
      StatCard.tsx         ← NEW: from combined stats pages
      PageHeader.tsx       ← NEW: from both game Headers
      GameShell.tsx        ← NEW: shared game page layout
      Toast.tsx            ← NEW: ephemeral notification
      PillButton.tsx       ← NEW: pill-shaped action button
      Badge.tsx            ← NEW: status badge
      index.ts             ← NEW: barrel exports
    (existing files unchanged)
  hooks/
    useModal.ts            ← NEW: extract modal logic
    useShare.ts            ← NEW: extract share logic
    useCountdown.ts        ← NEW: from pobach/CountdownTimer
    useAnimatedValue.ts    ← NEW: from valoshka/StatsPage
    (existing files unchanged)
```

---

### Task 1: useModal hook

**Files:**
- Create: `src/shared/hooks/useModal.ts`
- Create: `src/shared/hooks/useModal.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/shared/hooks/useModal.test.ts
import { act, renderHook } from "@testing-library/react";
import { useModal } from "./useModal";

describe("useModal", () => {
	it("starts closed by default", () => {
		const { result } = renderHook(() => useModal());
		expect(result.current.isOpen).toBe(false);
	});

	it("opens and closes", () => {
		const { result } = renderHook(() => useModal());

		act(() => result.current.open());
		expect(result.current.isOpen).toBe(true);

		act(() => result.current.close());
		expect(result.current.isOpen).toBe(false);
	});

	it("toggles state", () => {
		const { result } = renderHook(() => useModal());

		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(true);

		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(false);
	});

	it("provides ModalProps for component binding", () => {
		const { result } = renderHook(() => useModal());
		const props = result.current.ModalProps;

		expect(props.isOpen).toBe(false);
		expect(typeof props.onClose).toBe("function");

		act(() => result.current.open());

		expect(result.current.ModalProps.isOpen).toBe(true);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/shared/hooks/useModal.test.ts --no-coverage`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```ts
// src/shared/hooks/useModal.ts
"use client";

import { useCallback, useState } from "react";

export interface ModalState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	ModalProps: {
		isOpen: boolean;
		onClose: () => void;
	};
}

export function useModal(initialOpen = false): ModalState {
	const [isOpen, setIsOpen] = useState(initialOpen);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((v) => !v), []);

	const ModalProps = {
		isOpen,
		onClose: close,
	};

	return { isOpen, open, close, toggle, ModalProps };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/hooks/useModal.test.ts --no-coverage`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/useModal.ts src/shared/hooks/useModal.test.ts
git commit -m "feat: add useModal hook for shared modal logic"
```

---

### Task 2: useShare hook

**Files:**
- Create: `src/shared/hooks/useShare.ts`
- Create: `src/shared/hooks/useShare.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/shared/hooks/useShare.test.ts
import { act, renderHook } from "@testing-library/react";
import { useShare } from "./useShare";

describe("useShare", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("starts with isSharing=false and showToast=false", () => {
		const { result } = renderHook(() => useShare("hello"));
		expect(result.current.isSharing).toBe(false);
		expect(result.current.showToast).toBe(false);
	});

	it("falls back to clipboard when navigator.share is unavailable", async () => {
		const writeText = jest.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });

		// Ensure Web Share API is unavailable
		Object.defineProperty(navigator, "share", { value: undefined, writable: true });

		const { result } = renderHook(() => useShare("test text"));

		await act(async () => {
			await result.current.share();
		});

		expect(writeText).toHaveBeenCalledWith("test text");
		expect(result.current.showToast).toBe(true);

		act(() => jest.advanceTimersByTime(2100));
		expect(result.current.showToast).toBe(false);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/shared/hooks/useShare.test.ts --no-coverage`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```ts
// src/shared/hooks/useShare.ts
"use client";

import { useCallback, useState } from "react";

async function shareText(
	text: string,
): Promise<"share" | "clipboard" | false> {
	if (navigator.share) {
		try {
			await navigator.share({ text });
			return "share";
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") return false;
		}
	}

	try {
		await navigator.clipboard.writeText(text);
		return "clipboard";
	} catch {
		return false;
	}
}

export function useShare(text: string) {
	const [isSharing, setIsSharing] = useState(false);
	const [showToast, setShowToast] = useState(false);

	const doShare = useCallback(async () => {
		if (isSharing) return;
		setIsSharing(true);

		const result = await shareText(text);

		if (result === "clipboard") {
			setShowToast(true);
			setTimeout(() => setShowToast(false), 2000);
		}

		setIsSharing(false);
	}, [text, isSharing]);

	return { share: doShare, isSharing, showToast };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/hooks/useShare.test.ts --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/useShare.ts src/shared/hooks/useShare.test.ts
git commit -m "feat: add useShare hook for Web Share API + clipboard fallback"
```

---

### Task 3: useCountdown hook

**Files:**
- Create: `src/shared/hooks/useCountdown.ts`
- Create: `src/shared/hooks/useCountdown.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/shared/hooks/useCountdown.test.ts
import { renderHook } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("returns a formatted string HH:MM:SS", () => {
		// Mock Date to control "now"
		const realDate = Date;
		const mockNow = new Date("2026-05-10T20:00:00Z");
		jest.spyOn(Date, "now").mockImplementation(() => mockNow.getTime());

		const { result } = renderHook(() => useCountdown());
		expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/);

		jest.restoreAllMocks();
	});

	it("updates every second", () => {
		const { result: result1 } = renderHook(() => useCountdown());
		const first = result1.current;

		jest.advanceTimersByTime(1000);

		// Value changes are expected on next render
		expect(typeof first).toBe("string");
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/shared/hooks/useCountdown.test.ts --no-coverage`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```ts
// src/shared/hooks/useCountdown.ts
"use client";

import { useEffect, useState } from "react";

function msUntilNextMidnightUtc(): number {
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setUTCHours(24, 0, 0, 0);
	return tomorrow.getTime() - now.getTime();
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useCountdown(): string {
	const [timeLeft, setTimeLeft] = useState(() =>
		formatDuration(msUntilNextMidnightUtc()),
	);

	useEffect(() => {
		function update() {
			setTimeLeft(formatDuration(msUntilNextMidnightUtc()));
		}

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, []);

	return timeLeft;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/hooks/useCountdown.test.ts --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/useCountdown.ts src/shared/hooks/useCountdown.test.ts
git commit -m "feat: add useCountdown hook for UTC-midnight timer"
```

---

### Task 4: useAnimatedValue hook

**Files:**
- Create: `src/shared/hooks/useAnimatedValue.ts`
- Create: `src/shared/hooks/useAnimatedValue.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/shared/hooks/useAnimatedValue.test.ts
import { renderHook } from "@testing-library/react";
import { useAnimatedValue } from "./useAnimatedValue";

describe("useAnimatedValue", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("starts at 0 and animates toward target", () => {
		const { result } = renderHook(() => useAnimatedValue(42, 900));

		// Initially 0
		expect(result.current).toBe(0);

		// After full animation duration
		jest.advanceTimersByTime(1000);

		// Should be at or very close to target
		expect(result.current).toBe(42);
	});

	it("updates when target changes", () => {
		const { result, rerender } = renderHook(
			({ target }) => useAnimatedValue(target, 900),
			{ initialProps: { target: 10 } },
		);

		expect(result.current).toBe(0);

		jest.advanceTimersByTime(1000);
		expect(result.current).toBe(10);

		rerender({ target: 20 });

		jest.advanceTimersByTime(1000);
		expect(result.current).toBe(20);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/shared/hooks/useAnimatedValue.test.ts --no-coverage`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```ts
// src/shared/hooks/useAnimatedValue.ts
"use client";

import { useEffect, useState } from "react";

export function useAnimatedValue(target: number, duration = 900): number {
	const [value, setValue] = useState(0);

	useEffect(() => {
		let raf: number;
		const start = performance.now();

		const animate = (now: number) => {
			const t = Math.min((now - start) / duration, 1);
			setValue(Math.round(target * (1 - (1 - t) ** 3)));
			if (t < 1) raf = requestAnimationFrame(animate);
		};

		raf = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);

	return value;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/hooks/useAnimatedValue.test.ts --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/useAnimatedValue.ts src/shared/hooks/useAnimatedValue.test.ts
git commit -m "feat: add useAnimatedValue hook for count-up animations"
```

---

### Task 5: Modal component

**Files:**
- Create: `src/shared/components/ui/Modal.tsx`
- Create: `src/shared/components/ui/Modal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/shared/components/ui/Modal.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
	it("renders nothing when closed", () => {
		const { container } = render(
			<Modal isOpen={false} onClose={jest.fn()}>
				<p>Content</p>
			</Modal>,
		);
		expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
	});

	it("renders title and children when open", () => {
		render(
			<Modal isOpen={true} onClose={jest.fn()} title="Test Title">
				<p>Modal body</p>
			</Modal>,
		);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Modal body")).toBeInTheDocument();
	});

	it("calls onClose when Escape is pressed", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Esc test">
				<p>Body</p>
			</Modal>,
		);
		await userEvent.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onClose when backdrop is clicked", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Backdrop test">
				<p>Body</p>
			</Modal>,
		);
		await userEvent.click(screen.getByRole("dialog").parentElement!);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when dialog content is clicked", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Content click">
				<p>Body</p>
			</Modal>,
		);
		await userEvent.click(screen.getByText("Body"));
		expect(onClose).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest src/shared/components/ui/Modal.test.tsx --no-coverage`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// src/shared/components/ui/Modal.tsx
"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	maxWidth?: string;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = "480px",
}: ModalProps) {
	useEffect(() => {
		if (!isOpen) return;
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			role="presentation"
			className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--sly-bg)]/70 backdrop-blur-sm p-4"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? "modal-title" : undefined}
				className="bg-[var(--sly-bg-card)] border border-[var(--sly-border)] rounded-2xl shadow-2xl w-full overflow-y-auto"
				style={{ maxWidth, maxHeight: "90vh" }}
			>
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sly-border)]">
						<h2
							id="modal-title"
							className="font-display text-xl font-semibold text-[var(--sly-text)]"
						>
							{title}
						</h2>
						<button
							onClick={onClose}
							aria-label="Закрыць"
							type="button"
							className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--sly-text-muted)] hover:bg-[var(--sly-border)] transition-colors text-lg leading-none"
						>
							<X size={18} aria-hidden="true" />
						</button>
					</div>
				)}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/components/ui/Modal.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/ui/Modal.tsx src/shared/components/ui/Modal.test.tsx
git commit -m "feat: add shared Modal component with Escape-close and backdrop"
```

---

### Task 6: StatCard component

**Files:**
- Create: `src/shared/components/ui/StatCard.tsx`
- Create: `src/shared/components/ui/StatCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/shared/components/ui/StatCard.test.tsx
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
	it("renders label and value", () => {
		render(<StatCard label="Гульняў" value={42} />);
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("Гульняў")).toBeInTheDocument();
	});

	it("renders string value", () => {
		render(<StatCard label="Перамог %" value="85%" />);
		expect(screen.getByText("85%")).toBeInTheDocument();
	});

	it("has uppercase tracking-wider on label", () => {
		render(<StatCard label="Тэст" value={1} />);
		const label = screen.getByText("Тэст");
		expect(label.className).toContain("uppercase");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/components/ui/StatCard.test.tsx --no-coverage`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// src/shared/components/ui/StatCard.tsx
export interface StatCardProps {
	label: string;
	value: string | number;
	accent?: boolean;
}

export function StatCard({ label, value, accent = false }: StatCardProps) {
	return (
		<div
			className="flex flex-col gap-1 rounded-xl p-4"
			style={{
				background: "var(--sly-bg-card)",
				border: "1px solid var(--sly-border)",
			}}
		>
			<span className="text-[var(--sly-text-xs,0.75rem)] font-semibold uppercase tracking-wider text-[var(--sly-text-muted)]">
				{label}
			</span>
			<span
				className={`text-2xl font-bold font-display ${accent ? "text-[var(--sly-accent)]" : "text-[var(--sly-text)]"}`}
			>
				{value}
			</span>
		</div>
	);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/components/ui/StatCard.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/ui/StatCard.tsx src/shared/components/ui/StatCard.test.tsx
git commit -m "feat: add shared StatCard component"
```

---

### Task 7: Toast component

**Files:**
- Create: `src/shared/components/ui/Toast.tsx`
- Create: `src/shared/components/ui/Toast.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/shared/components/ui/Toast.test.tsx
import { render, screen } from "@testing-library/react";
import { Toast } from "./Toast";

describe("Toast", () => {
	it("renders message when visible", () => {
		render(<Toast message="Скапіравана!" visible={true} />);
		expect(screen.getByText("Скапіравана!")).toBeInTheDocument();
	});

	it("renders nothing when not visible", () => {
		const { container } = render(<Toast message="Скапіравана!" visible={false} />);
		expect(container.firstChild).toBeNull();
	});

	it("applies top position class by default", () => {
		const { container } = render(<Toast message="Test" visible={true} />);
		expect(container.firstChild).toHaveClass("-top-10");
	});

	it("applies bottom position class when specified", () => {
		const { container } = render(<Toast message="Test" visible={true} position="bottom" />);
		expect(container.firstChild).toHaveClass("-bottom-10");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/components/ui/Toast.test.tsx --no-coverage`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// src/shared/components/ui/Toast.tsx
export interface ToastProps {
	message: string;
	visible: boolean;
	position?: "top" | "bottom";
}

export function Toast({ message, visible, position = "top" }: ToastProps) {
	if (!visible) return null;

	const positionClass = position === "top" ? "-top-10" : "-bottom-10";

	return (
		<div
			aria-live="polite"
			className={`absolute ${positionClass} left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[var(--sly-text)] text-[var(--sly-bg)] text-xs font-medium whitespace-nowrap shadow-lg`}
		>
			{message}
		</div>
	);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/components/ui/Toast.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/ui/Toast.tsx src/shared/components/ui/Toast.test.tsx
git commit -m "feat: add shared Toast notification component"
```

---

### Task 8: PillButton component

**Files:**
- Create: `src/shared/components/ui/PillButton.tsx`
- Create: `src/shared/components/ui/PillButton.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/shared/components/ui/PillButton.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PillButton } from "./PillButton";

describe("PillButton", () => {
	it("renders children", () => {
		render(<PillButton onClick={jest.fn()}>Падказка</PillButton>);
		expect(screen.getByText("Падказка")).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = jest.fn();
		render(<PillButton onClick={onClick}>Click</PillButton>);
		await userEvent.click(screen.getByText("Click"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", async () => {
		const onClick = jest.fn();
		render(<PillButton onClick={onClick} disabled>Click</PillButton>);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/components/ui/PillButton.test.tsx --no-coverage`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// src/shared/components/ui/PillButton.tsx
import type { ReactNode } from "react";

export interface PillButtonProps {
	children: ReactNode;
	variant?: "primary" | "accent" | "ghost";
	size?: "sm" | "md";
	onClick: () => void;
	disabled?: boolean;
	icon?: ReactNode;
}

const variantClasses = {
	primary:
		"bg-[var(--sly-accent)] text-white hover:opacity-90",
	accent:
		"text-[var(--sly-accent)] border border-[var(--sly-accent)] hover:bg-[var(--sly-accent)]/5",
	ghost:
		"text-[var(--sly-text-muted)] border border-[var(--sly-border)] hover:bg-[var(--sly-border)]",
} as const;

const sizeClasses = {
	sm: "px-3 py-1 text-xs",
	md: "px-4 py-2 text-sm",
} as const;

export function PillButton({
	children,
	variant = "accent",
	size = "sm",
	onClick,
	disabled = false,
	icon,
}: PillButtonProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type="button"
			className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]}`}
		>
			{icon}
			{children}
		</button>
	);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/components/ui/PillButton.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/ui/PillButton.tsx src/shared/components/ui/PillButton.test.tsx
git commit -m "feat: add shared PillButton component"
```

---

### Task 9: Badge component

**Files:**
- Create: `src/shared/components/ui/Badge.tsx`
- Create: `src/shared/components/ui/Badge.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/shared/components/ui/Badge.test.tsx
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
	it("renders children", () => {
		render(<Badge>✓ Сёння</Badge>);
		expect(screen.getByText("✓ Сёння")).toBeInTheDocument();
	});

	it("applies accent variant by default", () => {
		const { container } = render(<Badge>Test</Badge>);
		const badge = container.firstChild as HTMLElement;
		expect(badge.style.background).toContain("accent-subtle");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/components/ui/Badge.test.tsx --no-coverage`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// src/shared/components/ui/Badge.tsx
import type { ReactNode } from "react";

export interface BadgeProps {
	children: ReactNode;
	variant?: "accent" | "success" | "neutral";
}

const variantStyles = {
	accent: {
		background: "var(--sly-accent-subtle)",
		color: "var(--sly-accent)",
		border: "1px solid var(--sly-accent-border)",
	},
	success: {
		background: "rgba(22, 163, 74, 0.1)",
		color: "var(--sly-green-500, #16a34a)",
		border: "1px solid rgba(22, 163, 74, 0.22)",
	},
	neutral: {
		background: "var(--sly-bg-surface)",
		color: "var(--sly-text-muted)",
		border: "1px solid var(--sly-border)",
	},
} as const;

export function Badge({ children, variant = "accent" }: BadgeProps) {
	const style = variantStyles[variant];
	return (
		<span
			className="text-xs font-bold uppercase tracking-wider rounded-full px-2.5 py-1 inline-block"
			style={style}
		>
			{children}
		</span>
	);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest src/shared/components/ui/Badge.test.tsx --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/ui/Badge.tsx src/shared/components/ui/Badge.test.tsx
git commit -m "feat: add shared Badge component"
```

---

### Task 10: Barrel exports + lint check

**Files:**
- Create: `src/shared/components/ui/index.ts`

- [ ] **Step 1: Create barrel export file**

```ts
// src/shared/components/ui/index.ts
export { Modal } from "./Modal";
export type { ModalProps } from "./Modal";

export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";

export { Toast } from "./Toast";
export type { ToastProps } from "./Toast";

export { PillButton } from "./PillButton";
export type { PillButtonProps } from "./PillButton";

export { Badge } from "./Badge";
export type { BadgeProps } from "./Badge";
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No new errors

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/shared/components/ui/index.ts
git commit -m "feat: add barrel exports for shared UI components"
```

---

### Task 11: Verify build and no visual regression

- [ ] **Step 1: Build the app**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run all tests one more time**

Run: `npm test`
Expected: All tests pass, including the new component and hook tests.

- [ ] **Step 3: Visual check — no existing pages should be broken**

Run: `npm run dev` and check:
- Hub page `/` loads correctly
- Pobach `/pobach` loads correctly
- Valoshka `/valoshka` loads correctly
- Theme toggle (light/dark) works on all pages
Expected: Zero visual change — new components are created but not yet integrated into existing pages.
