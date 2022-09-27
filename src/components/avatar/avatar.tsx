export default function Avatar({ username, isTalking }: { username: string, isTalking: boolean }) {
  return (
    <div className="flex items-center">
      <div className="rounded-full"
        style={{ width: 32, height: 32, margin: "4px 10px 4px 0", borderRadius: 24, background: isTalking ? "green" : "gray" }}
      />
      <p className="text-white">{username}</p>
    </div>
  );
}
