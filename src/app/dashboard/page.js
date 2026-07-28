import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Paper from "@/lib/models/paper";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const papers = await Paper.find({ userId: session.user.id })
    .select("title summary createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">My Papers</h1>
          <p className="text-base-content/60 mt-1">
            {papers.length === 0
              ? "Upload your first thesis to get started"
              : `You have ${papers.length} paper${papers.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link href="/papers/new" className="btn btn-primary text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload New
        </Link>
      </div>

      {papers.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 border-dashed">
          <div className="card-body items-center text-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No papers yet</h3>
            <p className="text-base-content/60 mb-6 max-w-md">
              Upload a thesis paper and Thesisteacher will break it down into
              simple, engaging explanations.
            </p>
            <Link href="/papers/new" className="btn btn-primary text-white">
              Upload Your First Paper
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <Link
              key={paper._id.toString()}
              href={`/papers/${paper._id}`}
              className="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="card-body p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold truncate">
                      {paper.title}
                    </h3>
                    {paper.summary && (
                      <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
                        {paper.summary}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm text-base-content/40">
                      {new Date(paper.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div
                      className={`badge badge-sm mt-1 ${
                        paper.summary ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {paper.summary ? "Explained" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}