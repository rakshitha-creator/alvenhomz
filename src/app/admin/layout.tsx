import AuthGate from "@/components/admin/AuthGate";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  );
}
