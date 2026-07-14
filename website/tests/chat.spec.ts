import { test, expect } from "@playwright/test";

test.describe("Chat", () => {
  test("home page exposes a Chat with AI clone CTA that links to /chat", async ({
    page,
  }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /chat with an ai clone of me/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/chat");
    await cta.click();
    await expect(page).toHaveURL("/chat");
  });

  test("/chat renders heading, disclosure, suggested prompts and input", async ({
    page,
  }) => {
    await page.goto("/chat");

    await expect(
      page.getByRole("heading", { name: /chat with ben/i, level: 1 }),
    ).toBeVisible();

    await expect(page.getByText(/an ai clone trained on/i)).toBeVisible();

    await expect(page.getByPlaceholder(/ask me anything/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^send$/i })).toBeVisible();

    await expect(
      page.getByRole("button", { name: /what are you building right now/i }),
    ).toBeVisible();
  });

  test("voice mute toggle is present and toggles aria-pressed", async ({
    page,
  }) => {
    await page.goto("/chat");
    const muteToggle = page.getByRole("button", { name: /mute voice/i });
    await expect(muteToggle).toBeVisible();
    await expect(muteToggle).toHaveAttribute("aria-pressed", "true");
    await muteToggle.click();
    await expect(
      page.getByRole("button", { name: /unmute voice/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("/chat layout does not horizontally scroll on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/chat");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
