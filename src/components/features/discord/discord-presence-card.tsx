export const DiscordPresenceCard = () => {
  const discordUserId = "683914336376455200";
  const lanyardUrl = `https://lanyard-profile-readme.vercel.app/api/${discordUserId}?theme=dark&bg=0d1117&animated=false&hideDiscrim=false&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...`;
  const discordProfileUrl = `https://discord.com/users/${discordUserId}`;

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
