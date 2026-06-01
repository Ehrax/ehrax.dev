import { expect, test } from "@playwright/test";

test("landing page renders all four sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("region", { name: "Hero" })).toBeVisible();
  await expect(page.getByRole("region", { name: "About" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Selected work" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Contact" })).toBeVisible();

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
