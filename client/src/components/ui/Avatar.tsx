type AvatarProps = {
  username: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Avatar({ username, size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl' };

  // Get first letter of username, uppercase
  const initial = username.charAt(0).toUpperCase();

  // Generate a consistent color based on username
  const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  const color = colors[username.charCodeAt(0) % colors.length];

  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-bold text-white`}>
      {initial}
    </div>
  );
}