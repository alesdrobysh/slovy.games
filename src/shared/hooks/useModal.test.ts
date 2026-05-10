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
