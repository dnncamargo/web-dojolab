import type { Metadata } from "next";
import localFont from 'next/font/local';
import Navbar from "./components/Navbar";
import './globals.css'; 

export const metadata: Metadata = {
  title: "Dojo Lab",
  description: "Sistema de Apoio a Gamificação",
};

const Antica_Regular_Font = localFont({
  src: '../public/fonts/antica-regular.ttf',
  variable: '--font-antica-regular'
});

const Harlow_Solid_Std_Font = localFont({
  src: '../public/fonts/harlow-solid-std.otf',
  variable: '--font-harlow-solid-std'
});

const Agency_FB_Font = localFont({
  src: '../public/fonts/agencyfbr.ttf',
  variable: '--font-agency-fb'
});

const Clock_Mono_Font = localFont({
  src: '../public/fonts/trackerclock-regular.otf',
  variable: '--font-clock-mono'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${Harlow_Solid_Std_Font.variable} ${Agency_FB_Font.variable} ${Antica_Regular_Font.variable} ${Clock_Mono_Font.variable} antialiased`}
      ><div className="min-h-screen bg-gray-100 p-6">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
