import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quran from "./Quran";
import { expect, vi, beforeAll } from "vitest";

// Mock fetch
global.fetch = vi.fn();

describe("quran component", () => {
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

  test("assure when random btn click the quran verse changes", async () => {
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
});
