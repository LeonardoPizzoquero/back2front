import { ComponentPropsWithoutRef, ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';

type ButtonProps = {
  icon?: ComponentType<IconBaseProps>;
  bg?: string;
} & ComponentPropsWithoutRef<'button'>;

const Button = ({
  icon: Icon,
  bg = 'bg-green-600',
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`flex flex-none items-center gap-2 text-white ${bg} rounded-lg px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-5`}
      {...rest}
    >
      {children}
      {Icon && <Icon className="flex-none" />}
    </button>
  );
};

export default Button;
