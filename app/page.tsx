"use client"
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  router.push("./login");
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
    loading...
    </div>
  );
}
