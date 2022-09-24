export default function Header() {
  return (
    <div
      data-tauri-drag-region
      style={{
        padding: "0 0 0 0",
        background: "#000",
        color: "#fff",
        userSelect: "none",
      }}
    >
      <h3
        data-tauri-drag-region
        style={{
          padding: "2px 0 2px 0",
          cursor: "default",
          userSelect: "none",
        }}
      >
        Overlayed
      </h3>
    </div>
  );
}
