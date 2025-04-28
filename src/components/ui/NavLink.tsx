import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <a 
      href={href} 
      className="text-gray-700 hover:text-[#C9252B] font-medium transition duration-200"
    >
      {children}
    </a>
  );
};
