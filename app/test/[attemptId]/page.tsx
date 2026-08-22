import { notFound, redirect } from "next/navigation";
import { getAttemptForRunner } from "@/lib/actions/test";
import TestRunner from "@/components/TestRunner";

export default async function TestRunnerPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  let data;
  try {
    data = await getAttemptForRunner(attemptId);
  } catch {
    notFound();
  }

  if (data.status === "completed") {
    redirect(`/test/${attemptId}/result`);
  }

  return <TestRunner data={data} />;
}
