import { Component, type ErrorInfo, type ReactNode } from "react";

const CHUNK_RELOAD_KEY = "raj:chunk-reloaded";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Last line of defence: if a page can't render (stale chunk after a deploy,
 * a failing third-party script, unexpected state) the visitor gets a small
 * recovery card instead of an empty white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("RAJ UI error:", error, info?.componentStack ?? "");
  }

  private reload = () => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {
      /* storage blocked — reload anyway */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#faf8f6",
          color: "#2b2725",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            background: "#fff",
            border: "1px solid rgba(43,39,37,0.12)",
            borderRadius: 16,
            padding: "36px 28px",
            boxShadow: "0 24px 60px -34px rgba(43,39,37,0.35)",
          }}
        >
          <div style={{ width: 34, height: 2, borderRadius: 2, background: "#9b6b3f", margin: "0 auto 18px" }} />
          <h1 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 8px", lineHeight: 1.35 }}>
            Etwas ist beim Laden schiefgelaufen.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 22px", color: "rgba(43,39,37,0.72)" }}>
            Lade die Seite einfach neu – dein Warenkorb bleibt erhalten.
          </p>
          <button
            type="button"
            onClick={this.reload}
            style={{
              appearance: "none",
              border: 0,
              cursor: "pointer",
              background: "#2b2725",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "12px 22px",
              borderRadius: 12,
            }}
          >
            Seite neu laden
          </button>
          <div style={{ marginTop: 14 }}>
            <a href="/" style={{ fontSize: 13, color: "#9b6b3f", textDecoration: "none" }}>
              Zur Startseite
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
