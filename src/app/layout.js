import "./globals.css";
import AudioPlayer from "../components/AudioPlayer";

export const metadata = {
  title: "Something Just for You!",
  description: "A little surprise made just for you, open it with a smile ❤️",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <AudioPlayer />
        {children}
      </body>
    </html>
  );
}
