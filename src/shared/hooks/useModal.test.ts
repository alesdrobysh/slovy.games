import { act, renderHook } from "@testing-library/react";
import { useModal } from "./useModal";

describe("useModal", () => {
	it("starts closed by default", () => {
		const { result } = renderHook(() => useModal());
		expect(result.current.isOpen).toBe(false);
	});

	it("respects initialOpen=true", () => {
		const { result } = renderHook(() => useModal(true));
		expect(result.current.isOpen).toBe(true);
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

		expect(result.current.ModalProps.isOpen).toBe(false);
		expect(typeof result.current.ModalProps.onClose).toBe("function");

		act(() => result.current.open());
		expect(result.current.ModalProps.isOpen).toBe(true);
		expect(result.current.isOpen).toBe(true);

		act(() => result.current.ModalProps.onClose());
		expect(result.current.isOpen).toBe(false);
	});
});
