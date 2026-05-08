import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';
import { usePathname } from 'next/navigation';

// Mock the next/navigation usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar', () => {
  it('renders the sidebar with navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(<Sidebar />);

    // Check for the main heading
    expect(screen.getByText('Meta The World')).toBeInTheDocument();

    // Check for some key navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Map View')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('NFT Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Dealership')).toBeInTheDocument();
    expect(screen.getByText('Ad Space')).toBeInTheDocument();
    expect(screen.getByText('Diamond District')).toBeInTheDocument();
    expect(screen.getByText('Crypto Prices')).toBeInTheDocument();
  });

  it('highlights the active link based on the current pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/inventory');

    render(<Sidebar />);

    // The 'Inventory' link should have the 'active' class or similar styling
    const inventoryLink = screen.getByText('Inventory');
    expect(inventoryLink.closest('a')).toHaveClass('bg-blue-600'); // Assuming bg-blue-600 is the active class

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.closest('a')).not.toHaveClass('bg-blue-600');
  });
});