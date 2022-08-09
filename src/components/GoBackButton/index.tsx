import { useRouter } from 'next/router';
import { FiChevronLeft } from 'react-icons/fi';

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()}>
      <a className="text-white text- flex items-center gap-2 mb-4 font-semibold">
        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center">
          <FiChevronLeft />
        </div>
        Go Back
      </a>
    </button>
  );
};

export default GoBackButton;
