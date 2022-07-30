import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full h-20 bg-gray-800 mb-10">
      <div className="mx-auto max-w-7xl px-4 flex items-center h-full">
        <Link href="/">
          <a className="text-white text-3xl font-semibold">
            Back<span className="text-red-500">2</span>Front
          </a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
