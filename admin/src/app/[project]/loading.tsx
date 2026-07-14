// Page-shaped skeleton: the layout's nav stays interactive above this while
// the force-dynamic page streams.
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-6 pt-6">
      <div className="border-t-2 border-rule pt-4">
        <div className="h-5 w-40 rounded bg-panel" />
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-2 w-14 rounded bg-panel" />
              <div className="mt-2 h-7 w-16 rounded bg-panel" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-12">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-2.5 w-24 rounded bg-panel" />
            <div className="mt-5 h-20 rounded bg-panel" />
          </div>
        ))}
      </div>
    </main>
  );
}
