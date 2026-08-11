import React from "react";
import SocialAuthButton from "./SocialAuthButton";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

type provider = "google";

type providerType = {
  name: provider;
  label: string;
  icon: string;
  size: number;
};
const providers: providerType[] = [
  {
    name: "google",
    label: "Continue with Google",
    icon: "/google.svg",
    size: 32,
  },
];

const SocialAuthButtons = () => {
  const handleOAuthLogin = async (provider: provider) => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="mt-8 space-y-4">
      {providers.map((provider) => (
        <SocialAuthButton
          key={provider.name}
          action={() => handleOAuthLogin(provider.name)}
        >
          <Image
            src={provider.icon}
            width={provider.size}
            height={provider.size}
            alt={provider.name}
          />
          {provider.label}
        </SocialAuthButton>
      ))}
    </div>
  );
};

export default SocialAuthButtons;
