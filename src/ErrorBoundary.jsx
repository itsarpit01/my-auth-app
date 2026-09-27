import { Component } from "react";

// Error Boundary sirf class component me ban sakta hai (React ka rule hai)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#064e3b",
            color: "#f8e7c9",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#f8e7c9",
              color: "#064e3b",
              border: "none",
              borderRadius: "4px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;