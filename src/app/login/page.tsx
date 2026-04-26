'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function KakaoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C5.582 2 2 4.925 2 8.5c0 2.254 1.42 4.236 3.57 5.387L4.67 17.1a.25.25 0 0 0 .375.27L9.3 14.95c.231.017.464.05.7.05 4.418 0 8-2.925 8-6.5S14.418 2 10 2z"
        fill="#3C1E1E"
      />
    </svg>
  )
}

// ─── 섹션 래퍼 ───────────────────────────────────────────────
function Section({
  number,
  tag,
  title,
  description,
  accent,
  children,
  reverse = false,
}: {
  number: string
  tag: string
  title: string
  description: string
  accent: string
  children: React.ReactNode
  reverse?: boolean
}) {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} className="px-6 py-20">
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-12 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}
      >
        {/* 텍스트 */}
        <div
          className="flex flex-1 flex-col gap-5"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : reverse ? 'translateX(24px)' : 'translateX(-24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold" style={{ color: accent }}>
              {number}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              {tag}
            </span>
          </div>
          <h2 className="text-3xl leading-tight font-bold text-gray-900">{title}</h2>
          <p className="text-base leading-relaxed text-gray-500">{description}</p>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        </div>

        {/* 이미지 영역 */}
        <div
          className="w-full flex-1"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
          }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}

// ─── 이미지 카드 ─────────────────────────────────────────────
function ImgCard({ src, alt, accent }: { src: string; alt: string; accent: string }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg"
      style={{ boxShadow: `0 8px 32px ${accent}18` }}
    >
      <Image src={src} alt={alt} width={900} height={600} className="h-auto w-full object-cover" unoptimized />
    </div>
  )
}

export default function LoginPage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.05)

  return (
    <div className="min-h-screen bg-white">
      {/* ── 히어로 ── */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6 pt-20 text-center">
        <div
          ref={heroRef}
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
          className="flex flex-col items-center gap-7"
        >
          <span className="bg-primary-100 text-primary-600 h2 rounded-full px-4 py-1 text-[#0D4556]">
            목표 · 시간 · 성장
          </span>
          <h1 className="max-w-2xl text-5xl leading-tight font-bold tracking-tight text-gray-900 md:text-6xl">
            내 하루를 <span className="text-[#1E7A90]">기록</span>하고
            <br />
            매일 <span className="text-[#1E7A90]">성장</span>해요
          </h1>
          <p className="max-w-md text-base leading-relaxed text-gray-500">
            목표를 세우고, 시간을 계획하고, 실제로 어떻게 썼는지 확인해요.
            <br />
            회고로 더 나은 내일을 만들어요.
          </p>
          <a
            href={KAKAO_AUTH_URL}
            className="flex items-center gap-2.5 rounded-2xl bg-[#FEE500] px-8 py-4 text-base font-semibold text-[#3C1E1E] shadow-md transition-all hover:opacity-90 hover:shadow-lg"
          >
            <KakaoIcon size={20} />
            카카오로 무료 시작하기
          </a>
          <div className="mt-4 flex flex-col items-center gap-1 text-gray-300">
            <span className="label-sm text-gray-500">스크롤해서 더 보기</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── 01 목표 카테고리 ── */}
      <GridSection
        number="01"
        tag="목표 관리"
        title="목표를 카테고리로 구조화해요"
        description="달성하고 싶은 목표를 큰 카테고리로 만들고, 세부 목표로 나눠요. 색상으로 구분해 한눈에 파악하고, 진행 상태를 추적해요."
        accent="#6366F1"
        bgColor="bg-white"
        cols={2}
        items={[
          {
            src: '/landing/goal-setting.png',
            label: '목표 카테고리',
            desc: '색상으로 구분해 한눈에 파악해요',
          },
        ]}
      />

      {/* ── 02 일간/주간/월간 ── */}
      <GridSection
        number="02"
        tag="일정 관리"
        title="일간 · 주간 · 월간으로 관리해요"
        description="하루의 계획을 시간표로 기록하고, 실제 수행 시간과 비교해요. 주간·월간 뷰로 전체 흐름을 한눈에 파악할 수 있어요."
        accent="#0EA5E9"
        bgColor="bg-gray-50"
        cols={3}
        items={[
          { src: '/landing/daily.png', label: '일간 뷰', desc: '시간표로 계획 vs 실제 비교' },
          { src: '/landing/week.png', label: '주간 뷰', desc: '7일 흐름을 한눈에' },
          { src: '/landing/month.png', label: '월간 뷰', desc: '달력으로 전체 조망' },
        ]}
      />

      {/* ── 03 차트 ── */}
      <GridSection
        number="03"
        tag="시간 분석"
        title="차트로 내 시간을 확인해요"
        description="목표별, 카테고리별로 시간이 어떻게 쓰였는지 시각화해요. 계획 달성률로 나의 실행력을 객관적으로 확인할 수 있어요."
        accent="#10B981"
        bgColor="bg-white"
        cols={2}
        items={[
          {
            src: '/landing/chart.png',
            label: '카테고리별 시간 분배',
            desc: '전체 · 목표 · 일반 카테고리별로 내 시간이 어디에 쓰였는지 확인해요',
          },
          {
            src: '/landing/chart2.png',
            label: '계획 달성률',
            desc: '계획한 시간과 실제 시간을 대조해 나의 실행력을 수치로 확인해요',
          },
        ]}
      />

      {/* ── 04 회고 ── */}
      <GridSection
        number="04"
        tag="회고"
        title="카테고리별로 회고해요"
        description="일간·주간·월간 단위로 회고를 작성해요. 어떤 목표에 집중했는지, 무엇을 개선할지 기록으로 남기고 더 나은 내일을 만들어요."
        accent="#F59E0B"
        bgColor="bg-gray-50"
        cols={2}
        items={[
          {
            src: '/landing/retrospect-image.png',
            label: '회고',
            desc: '일간·주간·월간 단위로 돌아봐요',
          },
        ]}
      />

      {/* ── 하단 CTA ── */}
      <section className="border-t border-gray-100 px-6 py-24 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-gray-900">지금 바로 시작해요</h2>
          <p className="text-gray-400">목표를 세우고 하루를 기록하는 첫 걸음</p>
          <a
            href={KAKAO_AUTH_URL}
            className="flex items-center gap-2.5 rounded-2xl bg-[#FEE500] px-8 py-4 text-base font-semibold text-[#3C1E1E] shadow-md transition-all hover:opacity-90 hover:shadow-lg"
          >
            <KakaoIcon size={20} />
            카카오로 무료 시작하기
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white px-8 py-6 text-center">
        <p className="text-xs text-gray-300">© 2026 나를(Naleul). All rights reserved.</p>
      </footer>
    </div>
  )
}

// ─── 그리드 섹션 ─────────────────────────────────────────────
function GridSection({
  number,
  tag,
  title,
  description,
  accent,
  bgColor = 'bg-white',
  items,
  cols = 2,
}: {
  number: string
  tag: string
  title: string
  description: string
  accent: string
  bgColor?: string
  items: { src: string; label: string; desc: string }[]
  cols?: 2 | 3
}) {
  const { ref, inView } = useInView()

  return (
    <section className={`${bgColor} px-6 py-20`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        {/* 헤더 */}
        <div
          ref={ref}
          className="flex flex-col gap-3"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold" style={{ color: accent }}>
              {number}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              {tag}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="max-w-xl text-base leading-relaxed text-gray-500">{description}</p>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        </div>

        {/* 그리드 */}
        <div className={`grid grid-cols-1 gap-6 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {items.map(({ src, label, desc }, i) => {
            const { ref, inView } = useInView()
            return (
              <div
                key={label}
                ref={ref}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                }}
                className="flex flex-col gap-3"
              >
                <div
                  className="overflow-hidden rounded-2xl border border-gray-100 shadow-md"
                  style={{ boxShadow: `0 8px 32px ${accent}18` }}
                >
                  <Image
                    src={src}
                    alt={label}
                    width={800}
                    height={400}
                    className="h-auto w-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
