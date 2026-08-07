import { expect, test } from '@playwright/test'

async function setAnimationDuration(page, duration) {
  await page.getByLabel('动画速度').evaluate((input, value) => {
    input.value = String(value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, duration)
}

async function waitForViewTransition(page) {
  await page.evaluate(async () => {
    await document.activeViewTransition?.finished
    await new Promise(requestAnimationFrame)
  })
}

function cardByTitle(page, title) {
  return page.locator('.card').filter({
    has: page.getByText(title, { exact: true })
  })
}

async function getCardOrder(page) {
  return page.locator('.card-title').allTextContents()
}

async function touchDrag(page, source, target) {
  const sourceBox = await source.boundingBox()
  const targetBox = await target.boundingBox()
  if (!sourceBox || !targetBox) throw new Error('Touch drag target is not visible')

  const start = {
    x: sourceBox.x + sourceBox.width / 2,
    y: sourceBox.y + sourceBox.height / 2
  }
  const end = {
    x: targetBox.x + targetBox.width / 2,
    y: targetBox.y + targetBox.height / 2
  }
  const client = await page.context().newCDPSession(page)

  try {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ ...start, id: 1 }]
    })

    const steps = 12
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{
          x: start.x + (end.x - start.x) * progress,
          y: start.y + (end.y - start.y) * progress,
          id: 1
        }]
      })
      await page.waitForTimeout(16)
    }

    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    })
  } finally {
    await client.detach()
  }
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

test('interrupting a view transition reaches both requested end states', async ({ page }) => {
  await setAnimationDuration(page, 1500)
  const headers = page.locator('.card-header')

  await headers.nth(0).dispatchEvent('click')
  await page.waitForTimeout(100)
  await headers.nth(1).dispatchEvent('click')
  await waitForViewTransition(page)

  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true')
  await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true')

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
  await waitForViewTransition(page)

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

test.describe('touch interactions', () => {
  test.use({ hasTouch: true })

  test('touch drag reorders cards and guards the release click', async ({ page }) => {
    const originalOrder = await getCardOrder(page)
    const firstCard = cardByTitle(page, '卡片 1')

    await touchDrag(
      page,
      firstCard.locator('.drag-handle'),
      cardByTitle(page, '卡片 4').locator('.card-header')
    )

    const reordered = await getCardOrder(page)
    expect(reordered).not.toEqual(originalOrder)
    expect(reordered.indexOf('卡片 1')).toBeGreaterThan(0)

    const movedHeader = cardByTitle(page, '卡片 1').locator('.card-header')
    await expect(movedHeader).toHaveAttribute('aria-expanded', 'false')

    await movedHeader.dispatchEvent('click')
    await expect(movedHeader).toHaveAttribute('aria-expanded', 'false')

    await page.waitForTimeout(120)
    await movedHeader.dispatchEvent('click')
    await expect(movedHeader).toHaveAttribute('aria-expanded', 'true')
  })

  test('touch drag interrupts an active view transition cleanly', async ({ page }) => {
    await setAnimationDuration(page, 1500)
    const firstHeader = page.getByRole('button', { name: '卡片 1', exact: true })

    await firstHeader.dispatchEvent('click')
    await page.waitForFunction(() => Boolean(document.activeViewTransition))
    expect(await page.evaluate(() =>
      getComputedStyle(document.documentElement, '::view-transition').pointerEvents
    )).toBe('none')
    await page.waitForTimeout(100)

    await touchDrag(
      page,
      cardByTitle(page, '卡片 2').locator('.drag-handle'),
      cardByTitle(page, '卡片 5').locator('.card-header')
    )

    await expect.poll(() => page.evaluate(() =>
      Boolean(document.activeViewTransition)
    ), { timeout: 500 }).toBe(false)

    await waitForViewTransition(page)
    await expect(firstHeader).toHaveAttribute('aria-expanded', 'true')

    await expect.poll(() => page.locator('.card').evaluateAll((cards) =>
      cards.filter((card) => card.style.transform || card.style.transition).length
    )).toBe(0)
  })
})
