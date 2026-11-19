import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <Link
        href="/ArPage"
        className="mt-3 block rounded-full bg-indigo-600 px-4 py-3 text-center font-semibold text-white"
      >
        ARへ
      </Link>
    </main>
  );
}
