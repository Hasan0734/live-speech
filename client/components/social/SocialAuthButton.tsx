import React from "react";

interface SocialButtonProps {
  children: React.ReactNode;
  action: () => void;
}

const SocialAuthButton = ({ children, action }: SocialButtonProps) => {
  return (
    <button
      onClick={action}
      type="button"
      className="w-full flex items-center justify-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-lg hover:bg-zinc-100 transition-all active:scale-[0.98] group"
    >
      {children}
    </button>
  );
};

export default SocialAuthButton;
