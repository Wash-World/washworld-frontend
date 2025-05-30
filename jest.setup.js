// jest.setup.js

// Enable fetch mocks globally so you can control network responses
// in every test without redefining `fetch` each time:
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();