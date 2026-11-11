import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'ASPHALES — Good work. Less guesswork.',
 description: 'For creators with a voice. For brands with a vision. A little certainty for every collaboration.',
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
 return <html lang="en"><body>{children}</body></html>;
}
