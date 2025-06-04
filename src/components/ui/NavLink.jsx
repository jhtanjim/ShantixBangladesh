


export const NavLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="text-gray-700 hover:text-[#C9252B] font-medium transition duration-200"
    >
      {children}
    </a>
  );
};
