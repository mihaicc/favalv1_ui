import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import QuoteStreamPage from './QuoteStreamPage'
import { fetchQuotes } from '../api'

vi.mock('../api', () => ({
  fetchQuotes: vi.fn(),
}))

const QUOTES = [
  { id: 1, author: 'Alice Smith', quote: 'Older quote text.', article_date: '2023-06-01', article_url: 'https://example.com/1' },
  { id: 2, author: 'Bob Jones', quote: 'Newer quote text.', article_date: '2024-03-15', article_url: 'https://example.com/2' },
  { id: 3, author: 'Carol White', quote: 'Newest quote text.', article_date: '2024-11-20', article_url: '' },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <QuoteStreamPage />
    </MemoryRouter>
  )
}

describe('QuoteStreamPage', () => {
  beforeEach(() => {
    fetchQuotes.mockResolvedValue(QUOTES)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Quote Stream' })).toBeInTheDocument()
  })

  it('shows loading indicator while data is pending', () => {
    fetchQuotes.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('shows all quotes after load', async () => {
    renderPage()
    expect(await screen.findByText('Newest quote text.')).toBeInTheDocument()
    expect(screen.getByText('Newer quote text.')).toBeInTheDocument()
    expect(screen.getByText('Older quote text.')).toBeInTheDocument()
  })

  it('orders quotes newest article_date first', async () => {
    renderPage()
    await screen.findByText('Newest quote text.')
    const cards = screen.getAllByRole('article')
    expect(cards[0]).toHaveTextContent('Carol White')
    expect(cards[cards.length - 1]).toHaveTextContent('Alice Smith')
  })

  it('shows quote count in section header', async () => {
    renderPage()
    expect(await screen.findByText(`${QUOTES.length} total · newest first`)).toBeInTheDocument()
  })

  it('renders author as a link to their profile', async () => {
    renderPage()
    await screen.findByText('Bob Jones')
    const link = screen.getByRole('link', { name: 'Bob Jones' })
    expect(link).toHaveAttribute('href', '/authors/bob-jones')
  })

  it('renders article date badge', async () => {
    renderPage()
    expect(await screen.findByText('Mar 15, 2024')).toBeInTheDocument()
  })

  it('renders source article link when url is present', async () => {
    renderPage()
    await screen.findByText('Newest quote text.')
    const links = screen.getAllByRole('link', { name: /source article/i })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('example.com'))
  })

  it('omits source link when article_url is empty', async () => {
    renderPage()
    await screen.findByText('Newest quote text.')
    // Carol White has empty article_url — only 2 source links for 3 quotes
    const links = screen.getAllByRole('link', { name: /source article/i })
    expect(links).toHaveLength(2)
  })

  it('handles empty quotes list gracefully', async () => {
    fetchQuotes.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('0 total · newest first')).toBeInTheDocument()
  })

  it('does not crash on fetch failure', async () => {
    fetchQuotes.mockRejectedValue(new Error('network error'))
    renderPage()
    // Page stays mounted; heading is still present after error settles
    await waitFor(() => expect(fetchQuotes).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('heading', { name: 'Quote Stream' })).toBeInTheDocument()
  })

  it('auto-refreshes every 60 seconds', async () => {
    vi.useFakeTimers()
    try {
      renderPage()
      await vi.waitFor(() => expect(fetchQuotes).toHaveBeenCalledTimes(1))

      await vi.advanceTimersByTimeAsync(60_000)
      expect(fetchQuotes).toHaveBeenCalledTimes(2)

      await vi.advanceTimersByTimeAsync(60_000)
      expect(fetchQuotes).toHaveBeenCalledTimes(3)
    } finally {
      vi.useRealTimers()
    }
  })
})
