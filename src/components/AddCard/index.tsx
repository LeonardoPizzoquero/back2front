import { ComponentPropsWithoutRef } from 'react';
import { FiPlus } from 'react-icons/fi';

const AddCard = ({ ...rest }: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      type="button"
      className="flex items-center justify-center w-full h-64 bg-gray-800 rounded-xl border-4 text-white text-2xl font-bold border-green-500 hover:bg-green-500 transition-all duration-200"
      {...rest}
    >
      <FiPlus size={64} className="mr-2" />
    </button>
  );
};

export default AddCard;
