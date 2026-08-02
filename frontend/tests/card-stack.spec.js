import { expect, test } from '@playwright/test'

async function setAnimationDuration(page, duration) {
  await page.getByLabel('动画速度').evaluate((input, value) => {
    input.value = String(value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, duration)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('card headers and animation control are keyboard accessible', async ({ page }) => {
  const firstHeader = page.getByRole('button', { name: '卡片 1', exact: true })
  const durationControl = page.getByLabel('动画速度')

  await expect(firstHeader).toHaveAttribute('aria-expanded', 'false')
  await firstHeader.focus()
  await page.keyboard.press('Enter')
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'true')
  await expect(durationControl).toBeVisible()
})

test('interrupting a FLIP animation leaves no inline transforms', async ({ page }) => {
  await setAnimationDuration(page, 1500)
  const headers = page.locator('.card-header')

  await headers.nth(0).dispatchEvent('click')
  await page.waitForTimeout(100)
  await headers.nth(1).dispatchEvent('click')
  await page.waitForTimeout(1600)

  const staleStyles = await page.locator('.card').evaluateAll((cards) =>
    cards.filter((card) => card.style.transform || card.style.transition).length
  )
  expect(staleStyles).toBe(0)
})

test('content resized during an animation is measured again afterward', async ({ page }) => {
  await setAnimationDuration(page, 1500)
  const firstCard = page.locator('.card').first()

  await firstCard.locator('.card-header').dispatchEvent('click')
  await page.waitForTimeout(100)
  await firstCard.locator('.card-body-inner').evaluate((content) => {
    const paragraph = document.createElement('p')
    paragraph.textContent = '动画期间动态加入的内容。'.repeat(30)
    content.appendChild(paragraph)
  })
  await page.waitForTimeout(1600)

  const heights = await firstCard.evaluate((card) => ({
    body: card.querySelector('.card-body').getBoundingClientRect().height,
    content: card.querySelector('.card-body-inner').scrollHeight
  }))
  expect(Math.abs(heights.body - heights.content)).toBeLessThanOrEqual(1)
})

test('mobile layout does not overflow the viewport horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.reload()

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    stackOverflowY: getComputedStyle(document.querySelector('.card-stack')).overflowY
  }))

  expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth)
  expect(layout.stackOverflowY).toBe('auto')
})
