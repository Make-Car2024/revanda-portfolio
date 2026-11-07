import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAME = 'Revanda'
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
let seen = false
try { seen = sessionStorage.getItem('intro') === '1'; sessionStorage.setItem('intro', '1') } catch { /* storage blocked */ }
const first = !seen && !reduce // module-level so StrictMode's double effect doesn't skip the loader

const WORKS = [
  {
    title: 'Website ZeroVault',
    meta: 'Website Penelitian Skripsi, 2026',
    img: 'public/skripsi.png',
    url: 'https://skripsi-revan.vercel.app/',
  },
  {
    title: 'Magang di DISKOMINFO Kabupaten Semarang',
    meta: 'intern, 2025',
    img: 'public\\magang.jpg',
    url: '#',
  },
  {
    title: 'Guru Praktikan SMA Nusaputera',
    meta: 'Guru Praktikan, 2025',
    img: 'public/ppl.jpg',
    url: '#',
  },
  {
    title: 'KKN di Kelurahan Wujil',
    meta: 'membuat website peminjaman buku, 2026',
    img: 'public\\kkn.jpeg',
    url: 'https://v0-library-management-system-lovat.vercel.app/',
  },
  {
    title: 'Laporan Proyek Kuliah',
    meta: 'Kumpulan Laporan',
    img: 'public\\lulus.JPG',
    url: 'https://drive.google.com/drive/folders/11XxF5MYxF2255mfX4BISF0F--1Re5TSw?usp=sharing',
  },
]
const SKILLS = [
  ['Design', 'Figma / Canva'],
  ['Development', 'HTML & CSS / JavaScript / React / Tailwind / Bootstrap '],
  ['Tools', 'Git / GitHub / VS Code / Microsoft Office '],
  ['Other', 'Problem Solving / Teamwork / Software Installation / Hardware Troubleshooting'],
]

const CERTS = [
  { year: '2025', title: 'Overview of AI', issuer: 'Huawei ICT Academy', url: 'https://drive.google.com/file/d/12Q_YCUAD5Ka0OOcYwdOvMgSLCkc8IzRD/view?usp=sharing' },
  { year: '2025', title: 'Build a Free Website with WordPress', issuer: 'Coursera', url: 'https://drive.google.com/file/d/1inE1W7xyTIOSKOs8uXI--Frr8RqZ_53t/view?usp=sharing' },
  { year: '2026', title: 'Test of Proficiency in English language', issuer: 'UNNES', url: 'https://drive.google.com/file/d/1fk9rQ63jr5m0848b5YuNBqkFZYeMZTuO/view?usp=sharing' },
]
const Arrow = () => (
  <b aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
  </b>
)

/* Wraps each rendered line in a mask. Call revert() to restore the original markup. */
function lines(el) {
  const orig = el.innerHTML
  const words = el.textContent.trim().split(/\s+/)
  const rows = []
  let top = null
  el.innerHTML = words.map((w) => `<span style="display:inline-block">${w}</span>`).join(' ')
  ;[...el.children].forEach((s) => {
    if (s.offsetTop !== top) { rows.push([]); top = s.offsetTop }
    rows[rows.length - 1].push(s.textContent)
  })
  el.innerHTML = rows.map((r) => `<span class="ln"><span class="li">${r.join(' ')}</span></span>`).join('')
  return { inner: el.querySelectorAll('.li'), revert: () => { el.innerHTML = orig } }
}

function intro(el, splits) {
  const loader = el.querySelector('.loader')
  const o = loader ? 1.05 : 0
  const h = lines(el.querySelector('.hero h1'))
  splits.push(h)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  if (loader) {
    tl.from('.lbrand', { opacity: 0, duration: 0.4 }, 0)
      .to('.lbar i', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to(loader, { opacity: 0, duration: 0.45, ease: 'power2.out', onComplete: () => { loader.style.display = 'none' } }, o)
  }
  tl.fromTo('.hero', { clipPath: 'inset(10% 5% 10% 5% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' }, o)
    .from('.nav', { y: -18, opacity: 0, duration: 0.8 }, o + 0.35)
    .fromTo('.portrait', { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath' }, o + 0.2)
    .from('.portrait > *', { scale: 1.08, duration: 1.6 }, o + 0.2)
    .from('.avail', { opacity: 0, y: 12, duration: 0.7 }, o + 0.45)
    .from(h.inner, { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.1, onComplete: h.revert }, o + 0.5)
    .from('.ch', { yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.07 }, o + 0.6)
    .from('.hero-r > *', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12 }, o + 0.85)
}

function scrollAnims(el, desktop) {
  const q = (s) => el.querySelector(s)
  const all = (s) => gsap.utils.toArray(s, el)
  const once = (trigger, start) => ({ trigger, start, once: true })
  const sec = q('#works')
  const track = q('.works')
  const sp = []
  const dist = () => Math.max(0, track.scrollWidth - (sec.clientWidth - 2 * parseFloat(getComputedStyle(sec).paddingLeft)))
  let tween

  all('.head h2, .lead, .contact h2').forEach((h) => {
    const s = lines(h)
    sp.push(s)
    gsap.from(s.inner, { yPercent: 110, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', onComplete: s.revert, scrollTrigger: once(h, 'top 88%') })
  })

  if (desktop) {
    sec.classList.add('hs')
    tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    })
  }
  all('.work').forEach((w, i) => {
    const ph = w.querySelector('.ph')
    const cap = w.querySelector('.cap')
    let st = once(w, 'top 85%')
    if (desktop) {
      if (i < 3) st = once(sec, 'top 60%') // already on screen when the pin starts
      else { st = once(w, 'left 92%'); st.containerAnimation = tween }
    }
    gsap.timeline({ scrollTrigger: st, delay: desktop && i < 3 ? i * 0.12 : 0 })
      .fromTo(ph, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' })
      .from(ph.children, { scale: 1.05, duration: 1.5, ease: 'power3.out' }, 0)
      .from(cap, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.35)
  })

  const p2 = q('.portrait2')
  gsap.fromTo(p2, { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: once(p2, 'top 82%') })
  gsap.from(p2.children, { scale: 1.06, duration: 1.6, ease: 'power3.out', scrollTrigger: once(p2, 'top 82%') })
  const small = q('.about .small')
  gsap.from(small, { y: 24, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out', scrollTrigger: once(small, 'top 90%') })

  all('.services li').forEach((li) => {
    gsap.timeline({ scrollTrigger: once(li, 'top 88%') })
      .from(li, { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
      .from(li.querySelector('h3'), { x: -32, duration: 1.1, ease: 'expo.out' }, 0)
      .from(li.querySelector('p'), { opacity: 0, duration: 0.9 }, 0.25)
  })

  const mail = q('.mail')
  gsap.from(q('.mail .btn'), { scale: 0.92, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: once(mail, 'top 92%') })
  gsap.from(all('.mail li'), { opacity: 0, y: 10, duration: 0.7, stagger: 0.1, delay: 0.2, ease: 'power2.out', scrollTrigger: once(mail, 'top 92%') })
  const foot = q('footer')
  gsap.from(foot.children, { opacity: 0, y: 12, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: once(foot, 'top 100%') })

  return () => { sec.classList.remove('hs'); sp.forEach((s) => s.revert()) }
}

function useAnimations(root) {
  useEffect(() => {
    if (reduce) return undefined
    const el = root.current
    const splits = []
    let ctx, mm, dead = false
    const refresh = () => ScrollTrigger.refresh()
    // wait for web fonts so line splitting measures the final wrapping (capped at 1.5s)
    Promise.race([document.fonts ? document.fonts.ready : 0, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      if (dead) return
      ctx = gsap.context(() => intro(el, splits), el)
      mm = gsap.matchMedia()
      mm.add({ d: '(min-width: 821px)', m: '(max-width: 820px)' }, (c) => scrollAnims(el, c.conditions.d), el)
    })
    addEventListener('load', refresh)
    return () => {
      dead = true
      removeEventListener('load', refresh)
      if (mm) mm.revert()
      if (ctx) ctx.revert()
      splits.forEach((s) => s.revert())
    }
  }, [root])
}

function Nav() {
  const [open, setOpen] = useState(false)
  const menu = useRef(null)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open && !reduce) {
      gsap.fromTo(menu.current.querySelectorAll('a'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.1, overwrite: true })
    }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', esc)
    return () => { removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [open])
  return (
    <header>
      <div className="nav">
        <span className="dot" aria-hidden="true" />
        <a className="brand" href="#top">{NAME}</a>
        <button className="burger" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><i /><i /></button>
      </div>
      <nav className={'menu' + (open ? ' open' : '')} id="menu" ref={menu} aria-label="Main" onClick={(e) => e.target.tagName === 'A' && setOpen(false)}>
        <a href="#works">Selected works</a>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#certificates">Certificates</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" style={{ paddingBottom: 0 }} aria-label="Introduction">
      <div className="hero-l">
        <p className="avail">Available for work</p>
        <h1>Informatics & Computer Engineering Education Graduate</h1>
      </div>
      <div className="hero-r">
        <p><strong>Hi, I’m {NAME}</strong> — a Web Developer with a background in Informatics Education, passionate about developing modern web applications, exploring new technologies, and delivering meaningful digital solutions.</p>
        <a className="btn" href="#works">See my works <Arrow /></a>
      </div>
      <figure className="portrait" style={{ margin: 0 }}>
        {<img src="src\assets\Revan.png" alt={`Portrait of ${NAME}`} /> }
      </figure>
      <div className="bigname" aria-hidden="true">
        {[...NAME].map((c, i) => <span className="ch" key={i}>{c === ' ' ? '\u00a0' : c}</span>)}
      </div>
    </section>
  )
}

function Works() {
  return (
    <section id="works" aria-labelledby="works-h">
      <div className="head"><h2 id="works-h">Selected works</h2><p className="small" style={{ margin: 0, maxWidth: '30ch' }}>2022–2026.</p></div>
      <div className="works">
        {WORKS.map(({ title, meta, img, url }) => {
          const Tag = url ? 'a' : 'div'
          const link = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {}
          return (
            <Tag className="work" key={title} {...link}>
              <div className="ph"><img src={img} alt={`${title} project`} /></div>
              <div className="cap"><h3>{title}</h3><p>{meta}</p></div>
            </Tag>
          )
        })}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" aria-labelledby="about-h">
      <div className="head"><h2 id="about-h">About</h2></div>
      <div className="about">
        <div className="portrait2"><img src="src\assets\evan_e_6804 4x6.jpg.jpeg" /></div>
        <div>
          <p className="lead">I build digital experiences through technology and creativity.</p>
          <p className="small">I'm Revanda, an Informatics and Computer Engineering Education graduate from Universitas Negeri Semarang. I have a strong interest in web development, particularly building responsive and user-friendly applications using React, Laravel, and modern web technologies.

Through academic projects, internships, and organizational experiences, I've developed skills in problem-solving, teamwork, and turning ideas into practical digital solutions. I'm always eager to explore new technologies, learn, and create meaningful work.</p>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-h">
      <div className="head"><h2 id="skills-h">Skills</h2></div>
      <ul className="services">
        {SKILLS.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
      </ul>
    </section>
  )
}

function Certificates() {
  return (
    <section id="certificates" aria-labelledby="certs-h">
      <div className="head"><h2 id="certs-h">Certificates</h2></div>
      <ul className="certs">
        {CERTS.map((c) => (
          <li key={c.title}>
            <span className="yr">{c.year}</span>
            <h3>{c.title}</h3>
            <p>{c.issuer}</p>
            {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">View →</a> : <span />}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <h2 id="contact-h">Let's connect and create something meaningful.</h2>
      <div className="mail">
        <a className="btn" href="mailto:revansputra33@gmail.com/">revansputra33@gmail.com <Arrow /></a>
        <ul><li><a href="https://www.instagram.com/revnwave/">Instagram</a></li><li><a href="https://wa.me/6285141181059">Whatsapp</a></li><li><a href="#"></a></li></ul>
      </div>
    </section>
  )
}

export default function App() {
  const root = useRef(null)
  useAnimations(root)
  return (
    <div ref={root}>
      {first && (
        <div className="loader" aria-hidden="true"><span className="lbrand">{NAME}</span><span className="lbar"><i /></span></div>
      )}
      <Nav />
      <main id="top">
        <Hero />
        <Works />
        <About />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <footer>
        <span>© 2026 {NAME}.</span>
        <nav aria-label="Footer"><a href="#works">Works</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#certificates">Certificates</a><a href="#contact">Contact</a></nav>
      </footer>
    </div>
  )
}
