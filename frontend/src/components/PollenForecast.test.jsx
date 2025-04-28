import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollenForecast from './PollenForecast';
import axios from 'axios';

// Mock the necessary API calls and window functions
jest.mock('axios');
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { postcode: '3168', locality: 'Clayton', lat: '-37.917', long: '145.128' }
    ])
  })
);

beforeEach(() => {
  fetch.mockClear();
  axios.get.mockClear();
});

describe('PollenForecast component', () => {

  test('renders search input and table', () => {
    render(<PollenForecast />);
    expect(screen.getByPlaceholderText(/search suburb or postcode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/daily allergy forecast/i)).toBeInTheDocument();
  });

  test('loads and displays location data', async () => {
    render(<PollenForecast />);
    await waitFor(() => expect(screen.getByText(/forecast for clayton/i)).toBeInTheDocument());
  });

  test('handles location search input change and displays filtered options', async () => {
    render(<PollenForecast />);
    fireEvent.change(screen.getByPlaceholderText(/search suburb or postcode/i), {
      target: { value: 'Clayton' },
    });

    await waitFor(() => expect(screen.getByText('Clayton (3168)')).toBeInTheDocument());
  });

  test('handles search submit and updates location', async () => {
    render(<PollenForecast />);
    fireEvent.change(screen.getByPlaceholderText(/search suburb or postcode/i), {
      target: { value: 'Clayton' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(screen.getByText(/forecast for clayton/i)).toBeInTheDocument());
  });

  test('fetches forecast and displays forecast table', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        daily_forecasts: [
          { types: { tree: { index: { value: 5, category: 'High' } }, grass: { index: { value: 2, category: 'Low' } } } }
        ],
      }
    });

    render(<PollenForecast />);
    await waitFor(() => expect(screen.getByText(/today/i)).toBeInTheDocument());

    // Check if forecast data is displayed in the table
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText(/low/i)).toBeInTheDocument();
  });

  test('handles geolocation errors gracefully', async () => {
    global.navigator.geolocation.getCurrentPosition = jest.fn().mockImplementationOnce((success, error) => {
      error();
    });

    render(<PollenForecast />);
    await waitFor(() => expect(screen.getByText(/forecast for clayton/i)).toBeInTheDocument());
  });

  test('handles forecast API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<PollenForecast />);
    await waitFor(() => expect(screen.getByText(/forecast for clayton/i)).toBeInTheDocument());
    // You can check for error handling here
    expect(console.error).toHaveBeenCalledWith('Forecast fetch failed:', expect.any(Error));
  });
});
