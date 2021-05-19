import "../styles/globals.css";
import useOneSignal from "../utils/useOneSignal";

function MyApp({ Component, pageProps }) {
  useOneSignal();
  return <Component {...pageProps} />;
}

export default MyApp;
