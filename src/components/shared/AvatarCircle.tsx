interface AvatarCircleProps {
  initial: string
  size?: number
}

export default function AvatarCircle({ initial, size = 60 }: AvatarCircleProps) {
  return (
    <div
      className="rounded-full bg-suara-green-avatar flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span
        className="text-suara-green font-extrabold"
        style={{ fontSize: size * 0.43 }}
      >
        {initial}
      </span>
    </div>
  )
}
