import Link from 'next/link';

type ItemCardProps = {
  name: string;
  href: string;
  description?: string;
};

const ItemCard = ({ href, name, description = '' }: ItemCardProps) => {
  return (
    <Link href={href}>
      <a
        href={href}
        className="flex items-center flex-col justify-center w-full p-8 h-64 bg-gray-800 rounded-xl border-4 text-white text-2xl font-bold border-purple-500 hover:bg-purple-500 transition-all duration-200"
      >
        <span>{name}</span>

        {description && (
          <p className="block text-base mt-4 text-center">{description}</p>
        )}
      </a>
    </Link>
  );
};

export default ItemCard;
