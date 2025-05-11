export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-background h-full flex items-center justify-center">
      {children}
    </section>
  );
}
