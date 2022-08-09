import { ReactNode } from 'react';

type PageTitleProps = {
  children: ReactNode;
};

const PageTitle = ({ children }: PageTitleProps) => {
  return <h1 className="text-4xl text-white font-bold">{children}</h1>;
};

export default PageTitle;
