import { useThemeContext } from "@/context/theme-context";
import { useEffect, useState } from "react";

export const DiscordPresenceCard = () => {
  const { theme } = useThemeContext();
  const discordUserId = "683914336376455200";
  const discordProfileUrl = `https://discord.com/users/${discordUserId}`;
  const [timestamp, setTimestamp] = useState(Date.now());

  // Update timestamp every 5 seconds to refresh the image
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Theme-aware Lanyard configuration
  // Light mode: theme=light&bg=e6e6e6 (matches --custom-background: 0 0% 90%)
  // Dark mode: theme=dark&bg=272a30 (matches --custom-background: 240 5% 15.9%)
  const themeConfig =
    theme === "dark"
      ? "theme=dark&bg=272a30"
      : "theme=light&bg=e6e6e6";

  const lanyardUrl = `https://lanyard-profile-readme.vercel.app/api/${discordUserId}?${themeConfig}&animated=false&hideDiscrim=false&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...&t=${timestamp}`;

  return (
    <a
      href={discordProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full overflow-hidden rounded-xl transition-opacity hover:opacity-90"
    >
      <img
        src={lanyardUrl}
        alt="Discord Presence of PP Namias"
        className="h-full w-full object-cover"
      />
    </a>
  );
};
