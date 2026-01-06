import React from 'react';
import GoogleIcon from './GoogleIcon';

type GoogleLoginButtonProps = {
  onClick?: () => void;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        flex items-center justify-center gap-3
        border rounded-[4px] border-gray-300
        py-3
        bg-white
        hover:bg-gray-50
        transition
        font-medium
        text-gray-700
      "
    >
      <GoogleIcon className="w-5 h-5" />
      <span>Login with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
