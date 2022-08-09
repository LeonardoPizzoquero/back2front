import { ReactNode } from 'react';

type DefaultPageContainerProps = {
  children: ReactNode;
};

const DefaultPageContainer = ({ children }: DefaultPageContainerProps) => {
  return <main className="max-w-7xl mx-auto px-4 pb-10">{children}</main>;
};

export default DefaultPageContainer;
