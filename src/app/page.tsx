import Link from 'next/link'

export default function Home() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`
  return (
    <main>
      <Link href={KAKAO_AUTH_URL}>카카오 로그인</Link>
    </main>
  );
}
