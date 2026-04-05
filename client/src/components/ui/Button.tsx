type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Button({
  children, onClick, type = 'button',
  variant = 'primary', disabled, fullWidth
}: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer';
  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/10',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}