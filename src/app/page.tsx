import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect root URL to default locale, e.g. /us/en
  redirect("/us/en");
}
