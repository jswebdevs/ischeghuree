import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardRedirectPath } from '@/utils/roleRedirect';

// /dashboard has no UI of its own — it fans out to the role dashboard.
// proxy.ts already routes most traffic, but anyone landing here directly
// (stale links, staff snooping guards, empty-role edge cases) is forwarded
// with the same role logic used by the login flow (roleRedirect).
export default async function DashboardIndexPage() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get('token')?.value || cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const rawRole = cookieStore.get('user_role')?.value;
  redirect(getDashboardRedirectPath(rawRole));
}
