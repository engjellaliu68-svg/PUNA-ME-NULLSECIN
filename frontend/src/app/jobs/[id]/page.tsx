import { JobDetails } from "@/features/jobs/JobDetails";

type JobDetailsPageProps = {
  params: { id: string };
};

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <JobDetails jobId={params.id} />
    </main>
  );
}
