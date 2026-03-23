import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuestionsList from '../pages/QuestionsList';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  }
}));

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('QuestionsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    api.default.get.mockImplementation(() => new Promise(() => {})); // pending promise
    renderWithRouter(<QuestionsList />);
    expect(screen.getByText(/Coding Challenges/i)).toBeInTheDocument();
    // Since skeleton doesn't have text, checking headers is fine
  });

  it('renders questions correctly after fetch', async () => {
    api.default.get.mockResolvedValueOnce({
      data: {
        data: [
          { _id: '1', title: 'Two Sum', difficulty: 'easy', status: 'unsolved' },
          { _id: '2', title: 'LRU Cache', difficulty: 'hard', status: 'solved' }
        ]
      }
    });

    renderWithRouter(<QuestionsList />);

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('LRU Cache')).toBeInTheDocument();
    });
  });

  it('shows empty state if no questions are found', async () => {
    api.default.get.mockResolvedValueOnce({
      data: { data: [] }
    });

    renderWithRouter(<QuestionsList />);

    await waitFor(() => {
      expect(screen.getByText(/No questions found matching your criteria/i)).toBeInTheDocument();
    });
  });
});
