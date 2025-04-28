interface ButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'lg';
  className?: string;
}

const Button = ({ children, size, className }: ButtonProps) => {
  return (
    <button
      className={`bg-red-500 text-white px-5 py-2 rounded-xs hover:bg-red-700 
      ${size === 'lg' ? 'py-3 px-6 text-xl' : ''} 
      ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
