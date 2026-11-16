// Pages render at full opacity straight away (a whole-page fade delayed the first paint and looked washed out).
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
