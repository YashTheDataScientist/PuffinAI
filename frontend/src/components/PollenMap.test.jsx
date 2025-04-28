import React from 'react';
import { render, waitFor } from '@testing-library/react';
import PollenMap from './PollenMap';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock for mapbox-gl (avoid rendering actual map in test)
jest.mock('mapbox-gl', () => {
  return {
    Map: function () {
      this.on = jest.fn();
      this.addControl = jest.fn();
      this.addSource = jest.fn();
      this.addLayer = jest.fn();
      this.setFeatureState = jest.fn();
    },
    NavigationControl: jest.fn(),
    Popup: jest.fn(() => ({
      setLngLat: jest.fn().mockReturnThis(),
      setHTML: jest.fn().mockReturnThis(),
      addTo: jest.fn().mockReturnThis(),
      remove: jest.fn(),
    })),
  };
});

// Mock server for API calls
const server = setupServer(
  rest.get('/data/vic_forecast_districts.geojson', (req, res, ctx) => {
    return res(
      ctx.json({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
            },
            properties: {
              DISTRICT: 'Test District',
            },
          },
        ],
      })
    );
  }),

  rest.get('https://pollen.googleapis.com/v1/forecast:lookup', (req, res, ctx) => {
    return res(
      ctx.json({
        dailyInfo: [
          {
            pollenTypeInfo: [
              { code: 'TREE', indexInfo: { value: 3 } },
              { code: 'GRASS', indexInfo: { value: 2 } },
            ],
          },
        ],
      })
    );
  })
);

// Start/stop server hooks
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Actual test
test('renders map container and loads data', async () => {
  const { container, getByText } = render(<PollenMap />);

  // Assert map container exists
  expect(container.querySelector('.map')).toBeInTheDocument();

  // Wait for geojson fetch and API fetch to finish
  await waitFor(() => {
    expect(container.querySelector('.map-legend')).toBeInTheDocument();
    expect(getByText(/Pollen UPI/i)).toBeInTheDocument();
  });
});
