import { listBookmarks } from "@/lib/actions/bookmarks";
import BookmarksBrowser from "@/components/BookmarksBrowser";

export default async function BookmarksPage() {
  const bookmarks = await listBookmarks();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">My Bookmarks</h1>
      <p className="mt-1 text-sm text-slate-500">
        Questions you&apos;ve tagged while practicing, grouped by category.
      </p>
      <BookmarksBrowser bookmarks={bookmarks} />
    </div>
  );
}
