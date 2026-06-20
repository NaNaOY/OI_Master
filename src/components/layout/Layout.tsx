import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};