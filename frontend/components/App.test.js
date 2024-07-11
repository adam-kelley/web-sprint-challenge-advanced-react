import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from './AppFunctional';

// Mock axios
jest.mock('axios');

test('sanity', () => {
  expect(true).toBe(true);
});

test('renders initial coordinates and steps', () => {
  render(<AppFunctional />);
  expect(screen.getByText('(2, 2)')).toBeInTheDocument();
  expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
});

test('moves left and updates coordinates and steps', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('LEFT'));
  expect(screen.getByText('(1, 2)')).toBeInTheDocument();
  expect(screen.getByText('You moved 1 time')).toBeInTheDocument();
});

test('moves up and updates coordinates and steps', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('UP'));
  expect(screen.getByText('(2, 1)')).toBeInTheDocument();
  expect(screen.getByText('You moved 1 time')).toBeInTheDocument();
});

test('moves right and updates coordinates and steps', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('RIGHT'));
  expect(screen.getByText('(3, 2)')).toBeInTheDocument();
  expect(screen.getByText('You moved 1 time')).toBeInTheDocument();
});

test('moves down and updates coordinates and steps', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText('DOWN'));
  expect(screen.getByText('(2, 3)')).toBeInTheDocument();
  expect(screen.getByText('You moved 1 time')).toBeInTheDocument();
});

