import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quran from "./Quran";
import { expect, vi, beforeAll } from "vitest";

// Mock fetch
global.fetch = vi.fn();

// mock clipboard API for test 3
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe("quran component", () => {
  // mock the response
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: "الفاتحة",
          transliteration: "Al-Fatihah",
          verses: [
            {
              id: 1,
              text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
              translation:
                "In the name of Allah, the Entirely Merciful, the Especially Merciful",
            },
            {
              id: 2,
              text: "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ",
              translation: "[All] praise is [due] to Allah, Lord of the worlds",
            },
          ],
        },
        {
          id: 2,
          name: "البقرة",
          transliteration: "Al-Baqarah",
          verses: [
            {
              id: 1,
              text: "الٓمٓ",
              translation: "Alif, Lam, Meem.",
            },
            {
              id: 2,
              text: "ذَٰلِكَ ٱلۡكِتَٰبُ لَا رَيۡبَۛ فِيهِۛ",
              translation: "This is the Book about which there is no doubt",
            },
          ],
        },
      ],
    });
  });

  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  test("assure verse changes", async () => {
    render(<Quran />);

    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.getByTestId("randomAyahBtn")).toBeInTheDocument();
    });

    const randomAyahBtn = screen.getByTestId("randomAyahBtn");
    const AyahText = screen.getByRole("heading", { level: 4 });
    const initialText = AyahText.textContent;

    await userEvent.click(randomAyahBtn);

    await waitFor(() => {
      expect(AyahText.textContent).not.toBe(initialText);
    });
  });

  test("assure translation appears", async () => {
    render(<Quran />);

    await waitFor(() => {
      expect(screen.getByTestId("translationBtn")).toBeInTheDocument();
    });

    const translationBtn = screen.getByTestId("translationBtn");
    await userEvent.click(translationBtn);

    const translatedAyah = screen.getByTestId("translatedAyah");

    await waitFor(() => {
      expect(translatedAyah).toBeInTheDocument();
    });
  });

  test("assure text is copied", async () => {
    render(<Quran />);

    await waitFor(() => {
      expect(screen.getByTestId("copyBtn")).toBeInTheDocument();
    });

    const copyBtn = screen.getByTestId("copyBtn");
    await userEvent.click(copyBtn);

    const shareNotification = screen.getByTestId("shareNotification");

    await waitFor(() => {
      expect(shareNotification).toBeInTheDocument();
    });

    // assure clipboard copying text was done once
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
  });
});
