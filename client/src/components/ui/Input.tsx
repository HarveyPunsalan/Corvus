type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export function Input({ label, type = 'text', value, onChange, placeholder, error }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-2 text-white
        placeholder:text-gray-600 focus:outline-none focus:border-teal-500
        transition-colors"
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}