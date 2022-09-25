export default function Avatar({ username }: { username: string }) {
  return (
    <div className="flex items-center">
      <div className="rounded-full bg-slate-600"
        style={{ width: 32, height: 32, margin: "4px 10px 4px 0", borderRadius: 24 }}
      />
      {username}
    </div>
  );
}
