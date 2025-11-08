import { useEffect, useState } from "react";

export const DiscordPresenceCard = () => {
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

  const lanyardUrl = `https://lanyard-profile-readme.vercel.app/api/${discordUserId}?theme=dark&bg=0d1117&animated=false&hideDiscrim=false&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...&t=${timestamp}`;

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
