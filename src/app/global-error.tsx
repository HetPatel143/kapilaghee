"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#FFF8E7", color: "#2A1B14" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "#8F1D18" }}>
            Kapila Dairy Farm
          </p>
          <p>Something went wrong loading this page. Please try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#8F1D18",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "2px",
              padding: "0.65rem 1.5rem",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
